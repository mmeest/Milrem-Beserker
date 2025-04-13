<template>
    <button class="engine-button" @click="$emit('toggle')">
        <span>{{ engineOn ? '🛑 STOP\nENGINE' : '🔋 START\nENGINE' }}</span>
    </button>
</template>

<script lang="ts" setup>
defineProps<{ engineOn: boolean }>()
</script>

<style scoped>
.engine-button {
    position: absolute;
    top: 16px;
    right: 16px;
    background-color: rgba(128, 128, 128, 0.8);
    border: 2px solid black;
    color: white;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    z-index: 999;
}
</style>