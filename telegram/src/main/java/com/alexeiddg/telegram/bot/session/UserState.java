package com.alexeiddg.telegram.bot.session;

public enum UserState {
    NONE,
    // Signup state
    SIGNUP,
    SIGNUP_NAME,
    SIGNUP_USERNAME,
    SIGNUP_ROLE,
    SIGNUP_MANAGER,
    SIGNUP_FINISH,
    // Login state
    LOGIN_USERNAME,
    // Main menu state
    MAIN_MENU,
    MAIN_MENU_BEGIN,
    MAIN_MENU_PROJECTS,
    MAIN_MENU_SPRINT,
    MAIN_MENU_TEAM,
    MAIN_MENU_CREATE_TASK,
    MAIN_MENU_VIEW_TASKS,
    // Project state
    PROJECT,
    // Project create state
    PROJECT_CREATE,
    PROJECT_CREATE_NAME,
    PROJECT_CREATE_DESCRIPTION,
    PROJECT_CREATE_MANAGER,
    PROJECT_CREATE_TEAM_DECISION,
    PROJECT_CREATE_TEAM_SELECT,
    PROJECT_CREATE_CONFIRMATION,
    // Project update state
    PROJECT_UPDATE,
    // Project delete state
    PROJECT_DELETE,
    PROJECT_DELETE_CONFIRM,
    // Sprint state
    SPRINT,
}
