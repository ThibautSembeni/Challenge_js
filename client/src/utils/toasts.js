import {createToast} from "mosha-vue-toastify";

export function createWarningToast(msg) {
    createToast(msg, {
        showIcon: 'true', type: 'warning', transition: 'slide',
    })
}

export function createDangerToast(msg) {
    createToast(msg, {
        showIcon: 'true', type: 'danger', transition: 'slide',
    })
}

export function createSuccessToast(msg) {
    createToast(msg, {
        showIcon: 'true', type: 'success', transition: 'slide',
    })
}

export function createInfoToast(msg) {
    createToast(msg, {
        showIcon: 'true', type: 'info', transition: 'slide',
    })
}

export function createDefaultToast(msg) {
    createToast(msg, {
        showIcon: 'true', type: 'default', transition: 'slide',
    })
}