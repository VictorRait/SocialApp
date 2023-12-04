import {useTheme} from "@emotion/react";
import {PersonAddOutlined, PersonRemoveOutlined} from "@mui/icons-material";
import {IconButton, Typography} from "@mui/material";
import {Box} from "@mui/system";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setFriends} from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImageWidget";

function Friend({friendId, name, subtitle, userPicturePath}) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {_id} = useSelector((state) => state.user);
	const token = useSelector((state) => state.token);
	const friends = useSelector((state) => state.user.friends);

	const {palette} = useTheme();
	const primaryLight = palette.primary.light;
	const primaryDark = palette.primary.dark;
	const main = palette.neutral.main;
	const medium = palette.neutral.medium;

	const isFriend =
		friends.length > 0 ? friends.find((friend) => friend._id === friendId) : "";
	const patchFriend = async () => {
		const res = await fetch(`http://localhost:3001/users/${_id}/${friendId}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			throw new Error(`HTTP error! Status: ${res.status}`);
			return;
		}

		const data = await res.json();

		console.log(res, data);
		dispatch(setFriends({friends: data}));
	};
	return (
		<FlexBetween>
			<FlexBetween gap="1rem">
				<UserImage image={userPicturePath} size="55px" />
				<Box
					onClick={() => {
						navigate(`/profile/${friendId}`);
						navigate(0);
					}}>
					{" "}
					<Typography
						color={main}
						variant="h5"
						fontWeight="500"
						sx={{"&:hover": {color: palette.primary.light}, cursor: "pointer"}}>
						{name}
					</Typography>
					<Typography color={medium} fontSize="0.75rem">
						{subtitle}
					</Typography>
				</Box>
			</FlexBetween>
			<IconButton
				onClick={() => patchFriend()}
				sx={{backgroundColor: primaryLight, p: "0.6rem"}}>
				{isFriend ? (
					<PersonRemoveOutlined sx={{color: primaryDark}} />
				) : (
					<PersonAddOutlined sx={{color: primaryDark}} />
				)}
			</IconButton>
		</FlexBetween>
	);
}

export default Friend;
