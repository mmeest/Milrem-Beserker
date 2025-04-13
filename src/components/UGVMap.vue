<template>
    <div class="map-container">
        <l-map ref="map" 
            style="height: 100%; 
            width: 100%;" 
            :zoom="13" 
            :center="ugvPosition">
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
        <div class="waypoint-list">
            <h3>Saved Waypoints</h3>
            <ul>
                <li v-for="waypoint in waypoints" :key="waypoint.id">
                    {{ waypoint.name }}
                    <button @click="driveTo(waypoint)">Drive</button>
                    <button @click="renameWaypoint(waypoint)">Rename</button>
                    <button @click="deleteWaypoint(waypoint)">Delete</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'vue3-toastify';
import * as L from 'leaflet';

//const props = defineProps<{ engineOn: boolean }>();
const map = ref();

const ugvPosition = ref<[number, number]>([59.437, 24.7536]);   // TALLINN
const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const props = defineProps<{ engineOn: boolean, waypoints: { id: number; name: string; position: [number, number]}[]}>();
const emit = defineEmits(['drive', 'rename', 'delete']);
//const renameWaypoint = (waypoint: typeof props.waypoints[0]) => emit('rename', waypoint);
//const deleteWaypoint = (waypoint: typeof props.waypoints[0]) => emit('delete', waypoint);

const waypoints = ref<{ id: number; name: string; position: [number, number]; marker: L.Marker }[]>([]);

const driveTo = (waypoint: typeof props.waypoints[0]) => {
    if (!props.engineOn) {
        toast.warning('Please start the engine before driving.', {
            theme: "dark",
            position: "bottom-left",
            toastClassName: "my-style-toast",
            transition: "slide"
        });
        return;
    }

    console.log(`Driving to waypoint: ${waypoint.name}`);

    if (map.value) {
        map.value.leafletObject.flyTo(waypoint.position, 13, { duration: 2000 });
    }

    moveUGV(waypoint.position);
};

// Movement
const moveUGV = (targetPosition: [number, number]) => {
    const currentPosition = ugvPosition.value;
    const steps = 50; // määrake sammude arv
    const stepLat = (targetPosition[0] - currentPosition[0]) / steps;
    const stepLng = (targetPosition[1] - currentPosition[1]) / steps;

    let stepCounter = 0;
    const interval = setInterval(() => {
        stepCounter++;
        if (stepCounter <= steps) {
            ugvPosition.value = [
                currentPosition[0] + stepLat * stepCounter,
                currentPosition[1] + stepLng * stepCounter
            ];
        } else {
            clearInterval(interval);
        }
    }, 50); // sammude vaheline aeg
};

const centerMap = () => {
    if (map.value) {
        map.value.leafletObject.setView(ugvPosition.value, 13);
    }
};

// Create marker icons
const greenIcon = L.icon({
    iconUrl: './src/mil.png',        // Engine On icon from local folder
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

let waypointId = ref(0);

const addWaypoint = (e: L.LeafletMouseEvent) => {
    const latLng = e.latlng;
    console.log('Adding waypoint at:', latLng);
    const newWaypoint = {
        id: waypointId.value++,  // Use the reactive ref
        name: `Waypoint ${waypointId.value}`,
        position: [latLng.lat, latLng.lng] as [number, number],
        marker: L.marker(latLng).addTo(map.value.leafletObject)
    };
    waypoints.value.push(newWaypoint);

    // Popup with selections
    const marker = newWaypoint.marker; // Use the already added marker
    const popupContent = document.createElement('div');
    popupContent.innerHTML = `
        <h4>${newWaypoint.name}</h4>
        `;
        /* <button class="popup-drive">Drive</button>        
        <button class="popup-rename">Rename</button>
        <button class="popup-delete">Delete</button> */

    marker.bindPopup(popupContent).openPopup();

    /* popupContent.querySelector('.popup-drive')?.addEventListener('click', () => driveTo(newWaypoint));
    popupContent.querySelector('.popup-rename')?.addEventListener('click', () => renameWaypoint(newWaypoint));
    popupContent.querySelector('.popup-delete')?.addEventListener('click', () => deleteWaypoint(newWaypoint)); */
};

// Renaming waypoint
const renameWaypoint = (waypoint: (typeof waypoints.value)[0]) => {
    const newName = prompt('Enter new name for the waypoint:', waypoint.name);
    if (newName) {
        waypoint.name = newName;
        // Värskendame markeri popupi nime
        waypoint.marker.bindPopup(`<h4>${waypoint.name}</h4>`).openPopup();
            /* <button class="popup-drive">Drive</button>
            <button class="popup-rename">Rename</button>
            <button class="popup-delete">Delete</button> */
    }
}

/* const deleteWaypoint = (waypoint: typeof props.waypoints[0]) => {
    waypoints.value = waypoints.value.filter(w => w.id !== waypoint.id);
}; */

const deleteWaypoint = (waypoint: (typeof waypoints.value)[0]) => {
    waypoint.marker.remove();
    waypoints.value = waypoints.value.filter(w => w.id !== waypoint.id);
};

// Handle keydown events for UGV movement
const handleKeyDown = (e: KeyboardEvent) => {
    // Check if the key is an arrow key
    const isArrowKey = [
        'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9'
    ].includes(e.code);
    
    if(!props.engineOn && isArrowKey){
        toast.warning(`${e.code} (pressed)\n Please start the engine before moving.`, {
            theme: "dark",
            position: "bottom-left",
            toastClassName: "my-style-toast",
            transition: "slide"    // bounce, slide, zoom, flip
        });
        return;
    }

    // Movement
    const [lat, lng] = ugvPosition.value;
    const step = 0.0001;            // Value for movement 
    switch (e.code) {        
        case 'Numpad8':                   // Movement direction: ↑ 
            ugvPosition.value = [lat + step, lng]; 
            break;
        case 'Numpad2':                   // Movement direction: ↓ 
            ugvPosition.value = [lat - step, lng]; 
            break;
        case 'Numpad4':                   // Movement direction: ←
            ugvPosition.value = [lat, lng - step]; 
            break;
        case 'Numpad6':                   // Movement direction: →
            ugvPosition.value = [lat, lng + step]; 
            break;  
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

    setTimeout(() => {
        if (map.value && map.value.leafletObject) {
            console.log('Map is ready');
            
            map.value.leafletObject.on('contextmenu', (e: L.LeafletMouseEvent) => {
                e.originalEvent.preventDefault(); 
                console.log('Contextmenu triggered'); 
                addWaypoint(e); 
            });
        } else {
            console.warn('Map is not yet ready');
        }
    }, 500);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);

    if (map.value && map.value.leafletObject) {
        map.value.leafletObject.off('contextmenu');
    }
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
    right: 20px;
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

.waypoint-list {
    position: absolute;
    z-index: 10;
    opacity: 0.7;
    top: 80px;
    right: 20px;
    background: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

</style>