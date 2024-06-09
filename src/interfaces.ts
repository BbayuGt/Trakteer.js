/**
 * Support history
 */
export interface supportHistory {
  /**
   * Status
   */
  status: "success" | "error";
  /**
   * Status code
   * @example 200 // if success
   * @example 404 // if error
   */
  status_code: number;
  /**
   * Error code
   */
  error_code?: string;
  /**
   * Error message
   */
  errors?: Record<any, any>;
  /**
   * Message
   * @example "OK" // if success
   */
  message: string;
  /**
   * Result query
   */
  result: {
    /**
     * Result data
     */
    data: {
      /**
       * Supporter name
       */
      supporter_name: string;
      /**
       * Supporter message
       */
      support_message: string;
      /**
       * Quantity of unit donated
       */
      quantity: number;
      /**
       * Amount of donation (in rupiah)
       */
      amount: number; // amount (in rupiah)
      /**
       * Unit name
       */
      unit_name: string;
      /**
       * date and time when the donation given, in ISO format.
       * @example "2022-07-02 09:22:05"
       */
      updated_at: string;
    }[];
    meta: Meta;
  } | null; // if success will return Object
}

/**
 * Goal Information
 */
export interface Goal {
  /** Info about Goal */
  target: {
    current: number;
    target: number;
    progress: number;
  };

  /** Goal Title */
  title: string;

  /** Page URL */
  url: string;
}

/**
 * Supporter Information
 */
export interface supporter {
  /** Display name of supporter */
  display_name: string;
  /** Message */
  support_message: string | null;
  /** Amount of unit donated */
  quantity: number;
}

/**
 * Donation Information (Raw)
 */
export interface rawDonation {
  /**
   * Donation Id
   */
  id: string;

  /**
   * Donation media if exists
   */
  media: Media | null;

  /**
   * Donation price (in string)
   * @example "Rp 100.000"
   */
  price: string;

  /**
   * Quantity of donation (in item)
   */
  quantity: number;

  /**
   * Supporter avatar
   */
  supporter_avatar: string;

  /**
   * Supporter message
   */
  supporter_message: string | null;

  /**
   * Supporter name
   */
  supporter_name: string;

  /**
   * Type of donation
   */
  type: string;

  /**
   * Unit name
   */
  unit: string;

  /**
   * Unit icon
   */
  unit_icon: string;
}

/**
 * Donation Information with added variable for better use
 */
export interface Donation extends rawDonation {
  /**
   * Price in number
   */
  price_number: number;
}

/**
 * Transaction History
 */
export interface transactionHistory {
  /**
   * Status
   */
  status: "success" | "error";
  /**
   * Status code
   */
  status_code: number;
  /**
   * Result
   */
  result: {
    /**
     * Result data
     */
    data: {
      /**
       * Creator name
       */
      creator_name: string;
      /**
       * Support message
       */
      support_message: string;
      /**
       * Quantity of unit donated
       */
      quantity: number;
      /**
       * Amount of donation (in rupiah)
       */
      amount: number;
      /**
       * Unit name
       */
      unit_name: string;
      /**
       * Status
       */
      status: string;
      /**
       * Updated at
       */
      updated_at: string;
      /**
       * Payment method
       */
      payment_method: string;
      /**
       * Order ID
       */
      order_id: string;
    }[];
    meta: Meta;
  };
  /**
   * Message
   */
  message: string;
}

/**
 * Meta data
 */
export interface Meta {
  /**
   * Currently have unknown use.
   */
  include: Array<string>;
  /**
   * Pagination data
   */
  pagination: {
    /**
     * total of donation
     */
    total: number;
    /**
     * Number of items shown
     */
    count: number;
    /**
     * Maximum number per page
     */
    per_page: number;
    /**
     * Current page
     */
    current_page: number;
    /**
     * Total of pages available
     */
    total_page: number;
    links: {
      /**
       * Link of previous page, may return undefined if it doesn't exists;
       */
      previous?: string;

      /**
       * Link of next page, may return undefined if it doesn't exists;
       */
      next?: string;
    };
  };
}

/**
 * Tip media if exists
 */
export interface Media {
  /**
   * ID gif selection from Giphy
   * @example "3oEduQAsYcJKQH2XsI"
   */
  gif?: string;

  video?: {
    /**
     * Youtube video id
     * @example "dQw4w9WgXcQ"
     */
    id: string;

    /**
     * Start youtube duration
     * @default 0
     */
    start: number;
  };
}

/**
 * Latest Tip Data
 */
export interface latestTip {
  /**
   * Unit icon URL
   */
  unitIcon: string;
  /**
   * Unit name
   */
  unitName: string;
  /**
   * Latest tip data
   */
  latestTip: {
    /**
     * Display name of supporter
     */
    display_name: string;
    /**
     * Support message
     */
    support_message: string;
    /**
     * Quantity of unit donated
     */
    quantity: number;
    /**
     * Media if exists
     */
    media: null | Media;
  }[];
}

/**
 * Last Supporter Data
 */
export interface lastSupporter {
  /**
   * Unit icon URL
   */
  unitIcon: string;
  /**
   * Unit name
   */
  unitName: string;
  /**
   * Supporter data
   */
  supporter: {
    /**
     * Total donation
     */
    sum: number;
    /**
     * Supporter Message
     */
    support_message: string;
    /**
     * Supporter name
     */
    name: string;
    /**
     * Supporter avatar
     */
    avatar: string | null;
  };
}

/**
 * Leaderboard Data
 */
export interface leaderboard {
  /**
   * Page Link
   * @example trakteer.id/xxx
   */
  pageUrl: string;
  /**
   * Unit icon URL
   * @returns URL or null if not exist
   * @example https://trakteer.id/storage/images/units/uic-6HrRTI84iwV97h7TcpJta4RcK0jhRbxK1620058283.png
   */
  unitIcon: string | null;
  /**
   * Unit name
   */
  unitName: string;

  /**
   * Supporter list
   */
  supporter: {
    /**
     * Supporter name
     * @returns String or "" if null
     */
    supporter_name: string | "";
    /**
     * Avatar URL
     * @returns URL or Null if no avatar
     * @example https:\/\/lh3.googleusercontent.com\/a-\/AOh14Gi45Ig9QTQozpqkD_SgPcB190KAwStLhex1Y-CT5w=s96-c
     */
    avatar: string | null;
    /**
     * Total donation
     */
    sum: number;
  }[];
}
