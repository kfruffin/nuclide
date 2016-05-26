'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {BookmarkInfo} from '../../nuclide-hg-repository-base/lib/HgService';
import type {Directory} from 'atom';

import {CompositeDisposable} from 'atom';
import {React, ReactDOM} from 'react-for-atom';
import RepositorySectionComponent from './RepositorySectionComponent';
import remote from 'remote';

const Menu = remote.require('menu');

type Props = {
  deleteBookmark: (bookmark: BookmarkInfo, repo: atom$Repository) => mixed;
  projectBookmarks: Map<string, Array<BookmarkInfo>>;
  projectDirectories: Array<Directory>;
  projectRepositories: Map<string, atom$Repository>;
  updateToBookmark: (bookmarkInfo: BookmarkInfo, repo: atom$Repository) => mixed;
};

type State = {
  activeModalComponent?: Object;
  selectedBookmark?: Object;
};

export default class VcsSideBarComponent extends React.Component {
  props: Props;
  state: State;

  _activeModalPanel: ?atom$Panel;
  _disposables: CompositeDisposable;
  _menuPopupTimeout: ?number;

  constructor(props: Props) {
    super(props);
    this._disposables = new CompositeDisposable();
    this.state = {};

    (this: any)._confirmDeleteBookmark = this._confirmDeleteBookmark.bind(this);
    (this: any)._destroyActiveModal = this._destroyActiveModal.bind(this);
    (this: any)._handleBookmarkClick = this._handleBookmarkClick.bind(this);
    (this: any)._handleBookmarkContextMenu = this._handleBookmarkContextMenu.bind(this);
    (this: any)._handleUncommittedChangesClick = this._handleUncommittedChangesClick.bind(this);
  }

  componentDidMount(): void {
    this._disposables.add(
      atom.commands.add('atom-workspace', 'core:cancel', this._destroyActiveModal)
    );
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    if (this.state.activeModalComponent !== prevState.activeModalComponent) {
      if (prevState.activeModalComponent != null) {
        this._destroyActiveModal();
      }
      if (this.state.activeModalComponent != null) {
        this._renderActiveModal();
      }
    }
  }

  componentWillUnmount() {
    this._disposables.dispose();
    if (this._menuPopupTimeout != null) {
      clearTimeout(this._menuPopupTimeout);
    }
  }

  _confirmDeleteBookmark(bookmark: BookmarkInfo, repo: atom$Repository): void {
    this.props.deleteBookmark(bookmark, repo);
    this._destroyActiveModal();
  }

  _destroyActiveModal(): void {
    const panel = this._activeModalPanel;
    if (panel != null) {
      ReactDOM.unmountComponentAtNode(panel.getItem());
      panel.destroy();
      this._activeModalPanel = null;
    }
  }

  _renderActiveModal(): void {
    if (this.state.activeModalComponent == null) {
      return;
    }

    let panel = this._activeModalPanel;
    if (panel == null) {
      const item = document.createElement('div');
      panel = this._activeModalPanel = atom.workspace.addModalPanel({item});
    }

    ReactDOM.render(this.state.activeModalComponent, panel.getItem());
  }

  _handleBookmarkClick(bookmark: BookmarkInfo, repo: atom$Repository): void {
    this.setState({selectedBookmark: bookmark});
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'fb-hg-smartlog:show-smartlog');
  }

  _handleBookmarkContextMenu(
    bookmark: BookmarkInfo,
    repo: atom$Repository,
    event: SyntheticMouseEvent
  ): void {
    const menu = Menu.buildFromTemplate([
      {
        click: () => {
          this.props.updateToBookmark(bookmark, repo);
        },
        enabled: !bookmark.active,
        label: `Update to ${bookmark.bookmark}`,
      },
      {type: 'separator'},
      {
        click: () => {
        },
        enabled: !bookmark.active,
        label: `Delete ${bookmark.bookmark}...`,
      },
    ]);

    // Store event position because React cleans up SyntheticEvent objects.
    // @see https://fb.me/react-event-pooling
    const clientX = event.clientX;
    const clientY = event.clientY;

    this.setState(
      {selectedBookmark: bookmark},
      () => {
        // Circumvent Electron / OS X render blocking bug.
        // @see https://github.com/electron/electron/issues/1854
        this._menuPopupTimeout = setTimeout(() => {
          menu.popup(remote.getCurrentWindow(), clientX, clientY);
        }, 35);
      }
    );
  }

  _handleUncommittedChangesClick(repo: atom$Repository): void {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'nuclide-diff-view:open');
  }

  render() {
    return (
      <div
        className="focusable-panel"
        style={{flex: 1, overflow: 'auto', position: 'relative', whiteSpace: 'normal'}}
        tabIndex="0">
        <ul className="list-unstyled">
          {this.props.projectDirectories.map((directory, index) => {
            const repository = this.props.projectRepositories.get(directory.getPath());
            const bookmarks = (repository == null)
              ? null :
              this.props.projectBookmarks.get(repository.getPath());

            return (
              <RepositorySectionComponent
                bookmarks={bookmarks}
                hasSeparator={index > 0}
                key={directory.getPath()}
                onBookmarkClick={this._handleBookmarkClick}
                onBookmarkContextMenu={this._handleBookmarkContextMenu}
                onUncommittedChangesClick={this._handleUncommittedChangesClick}
                repository={repository}
                selectedBookmark={this.state.selectedBookmark}
                title={directory.getBaseName()}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}
