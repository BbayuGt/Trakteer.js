export default interface StreamSettings {
    /**
     * Nama Level
     */
    level_name: string;

    /**
     * Tier Level (angka dalam bentuk string)
     */
    tier_level: string;

    /**
     * Apakah user dengan tier ini bisa menggunakan audio?
     */
    allow_audio: boolean;

    /**
     * Apakah user dengan tier ini bisa menggunakan text-to-speech?
     */
    allow_tts: boolean;

    /**
     * Apakah user dengan tier ini bisa menggunakan video?
     */
    allow_video: boolean;

    /**
     * Apakah user dengan tier ini bisa menggunakan gif?
     */
    allow_gif: boolean;

    /**
     * Apakah user dengan tier ini bisa menggunakan voice?
     */
    allow_voice: boolean;

    /**
     * Delay tiap media share (angka dalam bentuk string)
     */
    delay: string;

    /**
     * Durasi video
     */
    video_duration: number;

    /**
     * Maksimal durasi video
     */
    video_max_duration: number;

    /**
     * Apakah video_max_duration diaktifkan?
     */
    active_max_duration: boolean;

    /**
     * Durasi maksimal text-to-speech
     */
    tts_max_duration: number;
}
