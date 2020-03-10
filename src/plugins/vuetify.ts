import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'
import VuetifyToast from 'vuetify-toast-snackbar'

Vue.use(Vuetify, {
    components: {
        VSnackbar,
        VBtn,
        VIcon
    }
})

Vue.use(VuetifyToast, {
    x: 'center',
    showClose: true,
    closeIcon: 'mdi-close',
    closeColor: 'white'
})

export default new Vuetify({
})
