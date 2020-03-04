<style lang="stylus" scoped>

</style>

<template lang="pug">
.console-item-contaienr
    v-list-item
        v-list-item-icon.my-3.mr-4
            v-icon {{icon}}
        v-list-item-content
            v-list-item-title {{content}}
    v-divider
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ConsoleItem extends Vue {
    @Prop()
    content!: string

    @Prop()
    icon!: string
}
</script>
