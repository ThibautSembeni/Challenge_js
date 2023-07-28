import {createToast} from "mosha-vue-toastify";

export function createWarningToast(msg) {
    createToast(msg, {
        showIcon: 'true', type: 'warning', transition: 'slide',toastBackgroundColor: '#ffc107'
    })
}

export function createDangerToast(msg) {
    createToast(msg, {
        showIcon: 'true', type: 'danger', transition: 'slide',toastBackgroundColor: '#dc3545',
    })
}

export function createSuccessToast(msg) {
    createToast(msg, {
        showIcon: 'true', type: 'success', transition: 'slide',toastBackgroundColor: '#28a745'
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