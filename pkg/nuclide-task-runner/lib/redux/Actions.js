/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import type {Directory} from '../../../nuclide-remote-connection';
import type {
  AnnotatedTaskMetadata,
  DidActivateInitialPackagesAction,
  InitializeViewAction,
  TaskRunner,
  RegisterTaskRunnerAction,
  RunTaskAction,
  SelectTaskAction,
  SelectTaskRunnerAction,
  SetProjectRootAction,
  SetTaskListsAction,
  SetToolbarVisibilityAction,
  StopTaskAction,
  TaskId,
  TasksReadyAction,
  ToggleToolbarVisibilityAction,
  UnregisterTaskRunnerAction,
} from '../types';

export const DID_ACTIVATE_INITIAL_PACKAGES = 'DID_ACTIVATE_INITIAL_PACKAGES';
export const INITIALIZE_VIEW = 'INITIALIZE_VIEW';
export const REGISTER_TASK_RUNNER = 'REGISTER_TASK_RUNNER';
export const RUN_TASK = 'RUN_TASK';
export const SELECT_TASK_RUNNER = 'SELECT_TASK_RUNNER';
export const SELECT_TASK = 'SELECT_TASK';
export const SET_PROJECT_ROOT = 'SET_PROJECT_ROOT';
export const SET_TASK_LISTS = 'SET_TASK_LISTS';
export const SET_TOOLBAR_VISIBILITY = 'SET_TOOLBAR_VISIBILITY';
export const STOP_TASK = 'STOP_TASK';
export const TASKS_READY = 'TASKS_READY';
export const TASK_COMPLETED = 'TASK_COMPLETED';
export const TASK_PROGRESS = 'TASK_PROGRESS';
export const TASK_STARTED = 'TASK_STARTED';
export const TASK_STOPPED = 'TASK_STOPPED';
export const TASK_ERRORED = 'TASK_ERRORED';
export const TOGGLE_TOOLBAR_VISIBILITY = 'TOGGLE_TOOLBAR_VISIBILITY';
export const UNREGISTER_TASK_RUNNER = 'UNREGISTER_TASK_RUNNER';

export function didActivateInitialPackages(): DidActivateInitialPackagesAction {
  return {type: DID_ACTIVATE_INITIAL_PACKAGES};
}

export function initializeView(visible: boolean): InitializeViewAction {
  return {
    type: INITIALIZE_VIEW,
    payload: {visible},
  };
}

export function registerTaskRunner(taskRunner: TaskRunner): RegisterTaskRunnerAction {
  return {
    type: REGISTER_TASK_RUNNER,
    payload: {taskRunner},
  };
}

export function runTask(taskId?: TaskId): RunTaskAction {
  return {
    type: RUN_TASK,
    payload: {taskId},
  };
}

export function selectTask(taskId: TaskId): SelectTaskAction {
  return {
    type: SELECT_TASK,
    payload: {taskId},
  };
}

export function selectTaskRunner(taskRunnerId: string): SelectTaskRunnerAction {
  return {
    type: SELECT_TASK_RUNNER,
    payload: {taskRunnerId},
  };
}

export function setProjectRoot(projectRoot: ?Directory): SetProjectRootAction {
  return {
    type: SET_PROJECT_ROOT,
    payload: {projectRoot},
  };
}

export function setTaskLists(
  taskLists: Map<string, Array<AnnotatedTaskMetadata>>,
): SetTaskListsAction {
  return {
    type: SET_TASK_LISTS,
    payload: {taskLists},
  };
}

export function setToolbarVisibility(visible: boolean): SetToolbarVisibilityAction {
  return {
    type: SET_TOOLBAR_VISIBILITY,
    payload: {visible},
  };
}

export function stopTask(): StopTaskAction {
  return {type: STOP_TASK};
}

export function tasksReady(): TasksReadyAction {
  return {type: TASKS_READY};
}

export function toggleToolbarVisibility(taskRunnerId?: string): ToggleToolbarVisibilityAction {
  return {
    type: TOGGLE_TOOLBAR_VISIBILITY,
    payload: {taskRunnerId},
  };
}

export function unregisterTaskRunner(taskRunner: TaskRunner): UnregisterTaskRunnerAction {
  return {
    type: UNREGISTER_TASK_RUNNER,
    payload: {
      id: taskRunner.id,
    },
  };
}
