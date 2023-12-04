import {useTheme} from "@emotion/react";
import {Typography} from "@mui/material";
import {Box} from "@mui/system";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setFriends} from "state";

function FriendListWidget({userId}) {
	const dispatch = useDispatch();

	const {palette} = useTheme();
	const token = useSelector((state) => state.token);
	const friends = useSelector((state) => state.user.friends);
	console.log();
	const getFriends = async () => {
		try {
			const res = await fetch(
				`https://socialapp-i72u.onrender.com/users/${userId}/friends`,
				{
					method: "GET",
					headers: {Authorization: `Bearer ${token}`},
				}
			);

			if (res.ok) {
				const data = await res.json();
				console.log(res, data);

				dispatch(setFriends({friends: data}));
			} else {
				throw new Error("Something went wrong! Fetching friends");
			}
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getFriends();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	return (
		<WidgetWrapper>
			<Typography
				color={palette.neutral.dark}
				variant="h5"
				fontWeight="500"
				sx={{mb: "1.5rem"}}>
				Friend List
			</Typography>
			<Box display="flex" flexDirection="column" gap="1.5rem">
				{friends.length > 0
					? friends.map((friend, i) => (
							<Friend
								key={i}
								friendId={friend._id}
								name={`${friend.firstName} ${friend.lastName}`}
								subtitle={friend.occupation}
								userPicturePath={friend.picturePath}
							/>
					  ))
					: "Add friends to your list"}
			</Box>
		</WidgetWrapper>
	);
}

export default FriendListWidget;
