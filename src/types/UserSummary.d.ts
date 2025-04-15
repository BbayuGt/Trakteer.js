import ActiveUnit from "./ActiveUnit";
import PageStatus from "./PageStatus";
import StreamSettings from "./StreamSettings";
import UserGoal from "./UserGoal";

export interface UserSummary {
    /**
     * id user
     */
    id: string;

    /**
     * page id, tanpa URL
     * @example "username"
     */
    page: string;

    /**
     * Username
     */
    username: string;

    /**
     * Occupation, terletak di bawah username
     */
    occupation: string;

    /**
     * Cover image
     */
    cover_image: string;

    /**
     * Profile image
     */
    avatar: string;

    /**
     * Kategori
     */
    category: string;

    /**
     * Video url
     */
    video_url: string | null;

    /**
     * Summary
     */
    summary: string;

    /**
     * Sosial media kreator
     */
    socials: Record<string, string>;

    /**
     * Jumlah pengikut (Dalam bentuk string)
     */
    follower_count: string;

    /**
     * Apakah user ini diikuti oleh user yang sedang login
     */
    is_following: boolean;

    /**
     * Status kreator
     */
    page_status: PageStatus;

    /**
     * Apakah sedang live
     */
    is_live: boolean;

    /**
     * Setting stream kreator
     */
    stream_settings: Record<string, StreamSettings>;

    /**
     * Goal yang sedang aktif
     */
    active_goal?: {
        data: UserGoal;
    };

    /**
     * Unit yang sedang aktif
     */
    active_unit: {
        data: ActiveUnit;
    };
}
