
import {describe, test, expect} from "bun:test";
import User from "../src/core/User";

describe("Get User Info", () => {
	test("Get User ID from Page ID", async () => {
		const userId = await User.getUserId("trakteer.id");
		expect(userId).toBeString();
	})

	test("User not found (getUserId)", async() => {
		expect(async () => {
			await User.getUserId("thispagedefinitelynotexist123123123");
		}).toThrowError();
	})

	test("user not found (getUserDetails)", async () => {
		expect(async () => {
			await User.getUserDetails("sdsasdasd")
		}).toThrowError();
	})

	test("Get user details", async () => {
		const userId = await User.getUserId("trakteer.id");
		if (userId instanceof Error) return;
		const userDetails = await User.getUserDetails(userId);
			if (userDetails instanceof Error) return;
			expect(userDetails).toBeObject();
			
			expect(userDetails).toHaveProperty("id");
			expect(userDetails?.id).toBeString();

			expect(userDetails).toHaveProperty("page");
			expect(userDetails.page).toBeString();

			expect(userDetails).toHaveProperty("username");
			expect(userDetails.username).toBeString();

			expect(userDetails).toHaveProperty("occupation");
			expect(userDetails.occupation).toBeString();

			expect(userDetails).toHaveProperty("cover_image");
			expect(userDetails.cover_image).toBeString();

			expect(userDetails).toHaveProperty("avatar");
			expect(userDetails.avatar).toBeString();

			expect(userDetails).toHaveProperty("category");
			expect(userDetails.category).toBeString();

			expect(userDetails).toHaveProperty("video_url");
			if (userDetails.video_url) expect(userDetails.video_url).toBeString();
			else expect(userDetails.video_url).toBeNull();

			expect(userDetails).toHaveProperty("summary");
			expect(userDetails.summary).toBeString();

			expect(userDetails).toHaveProperty("socials");
			expect(userDetails.socials).toBeObject();

			expect(userDetails).toHaveProperty("follower_count");
			expect(userDetails.follower_count).toBeString();

			expect(userDetails).toHaveProperty("is_following");
			expect(userDetails.is_following).toBeBoolean();

			expect(userDetails).toHaveProperty("page_status");
			expect(userDetails.page_status).toBeObject();

			expect(userDetails).toHaveProperty("is_live");
			expect(userDetails.is_live).toBeBoolean();

			expect(userDetails).toHaveProperty("stream_settings");
			expect(userDetails.stream_settings).toBeObject();

			if (userDetails.active_goal) {
				expect(userDetails).toHaveProperty("active_goal");
				expect(userDetails.active_goal).toBeObject();
				expect(userDetails.active_goal).toHaveProperty("active_goal");
			}
			expect(userDetails).toHaveProperty("active_unit");
			expect(userDetails.active_unit).toBeObject();
			expect(userDetails.active_unit).toHaveProperty("data");

		});

})
