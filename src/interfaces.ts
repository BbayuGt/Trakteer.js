/**
 * Public API Stuff
 */

export interface supportHistory {
  status: "success" | "error";
  status_code: number; // 200 is success, anything else is probably a error
  error_code?: string;
  errors?: Object;
  message: string; // if success, will return "OK"
  result: {
    data: {
      supporter_name: string;
      support_message: string;
      quantity: number; // quantity of item donated
      amount: number; // amount (in rupiah)
      unit_name: string; // name of the unit
      updated_at: string; // date and time when the donation given, in ISO format. e.g. '2022-07-02 09:22:05'
    }[];
    meta: {
      include: Array<string>; // Currently have unknown use.
      pagination: {
        total: number; // total of donation;
        count: number; // Number of items shown;
        per_page: number; // Maximum number per page;
        current_page: number; // Current page;
        total_page: number; // Total of pages available;
        links: {
          previous?: string; // Link of previous page, may return undefined if it doesn't exists;
          next?: string; // Link of next page, may return undefined if it doesn't exists;
        };
      };
    };
  } | null; // if success will return Object
}

/**
 * Private API Stuff
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

export interface supporter {
  /** Display name of supporter */
  display_name: string;
  /** Message */
  support_message: string | null;
  /** Amount of unit donated */
  quantity: number;
}

export interface rawDonation {
  /**
   * Donation Id
   */
  id: string;

  /**
   * Donation media if exists
   */
  media: string | null;

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
  supporter_message: string;

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

export interface Donation extends rawDonation {
  /**
   * Price in number
   */
  price_number: number;
}

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
  supporter:
    | [
        {
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
        }
      ]
    | [];
}
