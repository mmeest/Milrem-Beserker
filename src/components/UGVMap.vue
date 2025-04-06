<template>
    <div class="map-container">
        <l-map ref="map" style="height: 100%; width: 100%;" :zoom="13" :center="ugvPosition">
            <l-tile-layer :url="tileLayerUrl" />
            <l-marker :lat-lng="ugvPosition" :icon="currentIcon">
                <l-popup>
                    <div class="popup-content">
                        <h3>UGV Position</h3>
                        <p>Latitude: {{ ugvPosition[0].toFixed(6) }}</p>
                        <p>Longitude: {{ ugvPosition[1].toFixed(6) }}</p>
                        <p>Status: {{ engineOn ? 'Engine Running' : 'Engine Stopped' }}</p>
                    </div>
                </l-popup>
            </l-marker>
        </l-map>
        <div class="info-box">
            <h3>UGV Position</h3>
            <p>Latitude: {{ ugvPosition[0].toFixed(6) }}</p>
            <p>Longitude: {{ ugvPosition[1].toFixed(6) }}</p>
            <p>Status: {{ engineOn ? 'Engine Running' : 'Engine Stopped' }}</p>
        </div>
        <img src="../img/mil.png" alt="MIP Logo" class="bottom-left-logo" />
        <button class="center-button" @click="centerMap">Find UGV</button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'vue3-toastify';
import * as L from 'leaflet';

const props = defineProps<{ engineOn: boolean }>();
const map = ref();

const ugvPosition = ref<[number, number]>([59.437, 24.7536]);   // TALLINN
const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const centerMap = () => {
    if (map.value) {
        map.value.leafletObject.setView(ugvPosition.value, 13);
    }
};

// Create marker icons
const greenIcon = L.icon({
    iconUrl: '/src/img/mil.png',        // Engine On icon from local folder
    iconSize: [41, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Compute current icon based on engine status
const currentIcon = computed(() => props.engineOn ? greenIcon : redIcon);

const handleKeyDown = (e: KeyboardEvent) => {
    // Check if the key is an arrow key
    const isArrowKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9'
    ].includes(e.code);
    
    if(!props.engineOn && isArrowKey){
        toast.warning(`${e.code} : Please start the engine before moving.`, {
            theme: "dark",
            toastClassName: "my-style-toast",
            transition: "zoom"    // bounce, slide, zoom, flip
        });
        return;
    }

    // Movement
    const [lat, lng] = ugvPosition.value;
    const step = 0.0001;            // Value for movement 
    switch (e.code) {        
        case 'ArrowUp':
        case 'Numpad8':                   // Movement direction: ↑ 
            ugvPosition.value = [lat + step, lng]; 
            break;
        case 'ArrowDown':
        case 'Numpad2':                   // Movement direction: ↓ 
            ugvPosition.value = [lat - step, lng]; 
            break;
        case 'ArrowLeft': 
        case 'Numpad4':                   // Movement direction: ←
            ugvPosition.value = [lat, lng - step]; break;
        case 'ArrowRight': 
        case 'Numpad6':                   // Movement direction: →
            ugvPosition.value = [lat, lng + step]; break;  
        case 'Numpad7':                   // Movement direction: ↖
            ugvPosition.value = [lat + step, lng - step];
            break;
        case 'Numpad9':                   // Movement direction: ↗
            ugvPosition.value = [lat + step, lng + step];
            break;
        case 'Numpad1':                   // Movement direction: ↙
            ugvPosition.value = [lat - step, lng - step];
            break;
        case 'Numpad3':                   // Movement direction: ↘
            ugvPosition.value = [lat - step, lng + step];
            break;  
        default:
            break;
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
});
</script>


<style>
.my-style-toast {
    background-color: rgba(49, 49, 76, 0.6);
    filter: drop-shadow(8px 8px 10px gray);
}
</style>

<style scoped>
.map-container {
    position: relative;
    height: 100%;
    width: 100%;
}

.leaflet-container {
    height: 100%;
    width: 100%;
    z-index: 1;
}

.info-box {
    position: absolute;
    top: 20px;
    left: 60px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    min-width: 200px;
}

.info-box h3 {
    margin: 0 0 10px 0;
    color: #333;
}

.info-box p {
    margin: 5px 0;
    color: #666;
}

.popup-content {
    text-align: center;
}

.popup-content h3 {
    margin: 0 0 10px 0;
    color: #333;
}

.popup-content p {
    margin: 5px 0;
    color: #666;
}

.bottom-left-logo {
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    max-width: 150px;
    height: auto;
    background-color: transparent;
    padding: 10px;
    border-radius: 5px;
}

.center-button {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
}

.center-button:hover {
    background-color: rgba(255, 255, 255, 1);
}

</style>