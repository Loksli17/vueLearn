<template>
    <div v-if="src.length !== 0">
        <div class="audio-player-container">
            <button 
                class="audio-player-play-button"
                @click="togglePlayer">
                {{ playButtonText }}
            </button>
            <div class="audio-player-controls">
                <div ref="progressBarContainer" class="audio-player-progress-bar-container">
                    <div 
                        ref="progressBarHandle"
                        class="audio-player-progress-bar-handle"
                        :style="progressBarHandleStyle">
                    </div>
                    <div 
                        class="audio-player-progress-bar"
                        :style="progressBarStyle"
                        >
                    </div>
                </div>
                <span> {{ currentDisplayable }} / {{ durationDisplayable }} </span>
            </div>
        </div>

        <audio 
            ref="audio"
            :src="require('@/assets/audio/test.mp3')"
            preload
            controls
            format="audio/mp3"
            >
        </audio>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, onMounted, ref } from 'vue';
    import { clamp } from "./utils";

    enum PlayerState {
        PLAYING,
        PAUSED,
        LOADING,
        LOADED,
        SEEKING
    }

    export default defineComponent({
        
        props:
        {
            src:
            {
                type: String,
                required: true
            }
        },

        emits: [
            "loaded-data",
            "loaded-metadata",
            "can-play",
            "can-play-through",
            "ended",
            "pause",
            "play",
            "playing",
            "progress",
            "seeked",
            "seeking",
            "time-update",
            "volume-change",
            "error"
        ],
        
        setup(_, { emit })
        {
            const
                audio = ref(null),
                progressBarContainer = ref(null),
                progressBarHandle = ref(null);
            
            const
                duration = ref(0),
                current  = ref(0),
                state    = ref(PlayerState.LOADING);

            const progressBarLeftPos = ref(0);

            
            onMounted(() => {
                // console.log(audio.value);
                const audioEl = audio.value as unknown as HTMLAudioElement;
                
                audioEl.addEventListener("loadedmetadata", (e: Event) => {
                    emit("loaded-metadata", e);
                })

                audioEl.addEventListener("loadeddata", (e: Event) => {
                    state.value = PlayerState.LOADED;
                    emit("loaded-data", e);
                });

                audioEl.addEventListener("durationchange", () => {
                    duration.value = audioEl.duration;
                });

                audioEl.addEventListener("timeupdate", () => {
                    current.value = audioEl.currentTime;
                })

                audioEl.addEventListener("play", (e: Event) => {
                    state.value = PlayerState.PLAYING;
                    emit("play", e);
                });

                audioEl.addEventListener("pause", (e: Event) => {
                    state.value = PlayerState.PAUSED;
                    emit("pause", e);
                });

                const 
                    progressBarHandleEl    = progressBarHandle.value as unknown as HTMLDivElement,
                    progressBarContainerEl = progressBarContainer.value as unknown as HTMLDivElement;

                const setHandlePos = (mouseX?: number) => {
                    const rect = progressBarContainerEl.getBoundingClientRect();
                    const x = (mouseX ?? parseInt(progressBarStyle.value.width)) - rect.left;
                }

                progressBarHandleEl.addEventListener("mousedown", () => {

                    const onMove = (e: MouseEvent) => {
                        // const rect = progressBarContainerEl.getBoundingClientRect();
                        setHandlePos(e.clientX);
                    }

                    const listener = (e: MouseEvent) => {
                        onMove(e);
                    }

                    document.addEventListener("mousemove", listener);

                    document.addEventListener("mouseup", () => {
                        document.removeEventListener("mousemove", listener)
                    })
                })
            });

            const play = (): void => {
                const audioEl = audio.value as unknown as HTMLAudioElement;
                
                if (audioEl) 
                {
                    audioEl.play();
                    state.value = PlayerState.PLAYING;
                }
            }

            const pause = (): void => {
                const audioEl = audio.value as unknown as HTMLAudioElement;
                
                if (audioEl)
                {
                    audioEl.pause();
                    state.value = PlayerState.PAUSED;
                }
            }

            const progressBarStyle = computed(() => {
                const progressBarContainer = document.querySelector(".audio-player-progress-bar-container");
                let width = 0;
                if (progressBarContainer) 
                {
                    width = parseInt(getComputedStyle(progressBarContainer).width);
                }

                return {
                    width: `${(width / duration.value) * current.value}px`
                }
            });

            const togglePlayer = (): void => {
                switch(state.value) {
                    case PlayerState.PAUSED:
                    case PlayerState.LOADED:
                        play();
                        break;
                    case PlayerState.PLAYING:
                        pause();
                        break;
                }
            }

            const playButtonText = computed(() => {
                switch(state.value) {
                    case PlayerState.PAUSED:
                    case PlayerState.LOADED:
                        return "play";
                    case PlayerState.PLAYING:
                        return "pause";
                    default:
                        return "play";
                }
            });

            const currentDisplayable = computed(() => {
                return `${Math.trunc(current.value / 60).toString().padStart(2, '0')}:${Math.trunc(current.value % 60).toString().padStart(2, '0')}`;
            });

            const durationDisplayable = computed(() => {
                return `${Math.trunc(duration.value / 60).toString().padStart(2, '0')}:${Math.trunc(duration.value % 60).toString().padStart(2, '0')}`;
            });

            return {
                audio,
                progressBarContainer,
                progressBarHandle,
                play,
                pause,
                togglePlayer,
                currentDisplayable,
                durationDisplayable,
                playButtonText,
                progressBarStyle,
                // progressBarHandleStyle,
            };
        },
    });
</script>

<style lang="scss">
    .audio-player-container {
        // .audio-player-play-button {
        //     //
        // }

        .audio-player-controls {
            .audio-player-progress-bar-container {
                position: relative;
                width: 100%;
                background-color: gray;

                .audio-player-progress-bar-handle {
                    cursor: pointer;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: orange;
                    position: absolute;
                    top: -4px;
                    left: -3px;
                }

                .audio-player-progress-bar {
                    background-color: red;
                    height: 4px;
                }
            }
        }

    }
</style>