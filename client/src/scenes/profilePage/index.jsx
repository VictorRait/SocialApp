import {Box, useMediaQuery} from "@mui/material";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";

function ProfilePage() {
	const [user, setUser] = useState(null);
	const {userId} = useParams();
	const token = useSelector((state) => state.token);
	const isNonMobileScreens = useMediaQuery("(min-width:1000px");
	console.log("hi");

	const getUser = async () => {
		try {
			const res = await fetch(
				`https://socialapp-i72u.onrender.com/users/${userId}`,
				{
					method: "GET",
					headers: {Authorization: `Bearer ${token}`},
				}
			);
			const data = await res.json();
			console.log(data);
			setUser(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		// Log inside useEffect to capture the updated state after the fetch
		console.log(user);
		getUser();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	return (
		<Box>
			<Navbar />
			<Box
				width="100%"
				p="2rem 6%"
				display={isNonMobileScreens ? "flex" : "block"}
				gap="2rem"
				justifyContent="center">
				<Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
					<UserWidget userId={userId} picturePath={user?.picturePath} />
					<Box m="2rem 0" />
					<FriendListWidget userId={userId} />
				</Box>
				<Box
					flexBasis={isNonMobileScreens ? "42%" : undefined}
					mt={isNonMobileScreens ? undefined : "2rem"}>
					<MyPostWidget picturePath={user?.picturePath} />
					<Box m="2rem 0" />
					<PostsWidget userId={userId} />
				</Box>
			</Box>
		</Box>
	);
}

export default ProfilePage;
