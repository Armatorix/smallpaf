import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	TextField
} from "@mui/material";
import { useState } from "react";
import { useResetRecoilState } from "recoil";
import useStatesUpdates from "../api";
import { currentRoomState } from "../store";

const defautlImportValue = {
	FilterId: 0,
};

const ImportTicketsModal = (props) => {
	const [open, setOpen] = useState(false);
	const [importBody, setImportBody] = useState(defautlImportValue);
	const resetRoom = useResetRecoilState(currentRoomState);
	const [progress, setProgress] = useState(false);
	const { importTickets } = useStatesUpdates();
	return (
		<>
			<Button
				{...props}
				variant="outlined"
				onClick={() => setOpen(true)}
				style={{
					minWidth: "3.5em",
				}}
				startIcon={<ImportExportIcon />}
				color="primary"
			>
				Import tickets
			</Button>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				maxWidth="md"
				fullWidth
			>
				<FormControl
					component="form"
					onSubmit={(e) => {
						setProgress(true);
						e.preventDefault();
						importTickets(props.roomid, importBody)
							.then(() => {
								setImportBody(defautlImportValue);
								resetRoom();
								setOpen(false);
							})
							.catch((err) => {
								console.log(err);
							})
							.finally(() => setProgress(false));
					}}
				>
					<DialogTitle justifyContent="center">
						Import tickets by filter
					</DialogTitle>
					<DialogContent>
						<DialogContent>
							<TextField
								id="filter-number"
								label="Filter number"
								type="number"
								value={importBody.FilterId}
								fullWidth
								required
								onChange={(e) =>
									setImportBody({
										FilterId: parseInt(e.target.value),
									})
								}
							/>
						</DialogContent>
					</DialogContent>
					<DialogActions>
						<Button
							type="submit"
							variant="outlined"
							fullWidth
							startIcon={<AddIcon />}
							disabled={progress}
						>
							Import
						</Button>
						<Button
							variant="outlined"
							fullWidth
							onClick={() => {
								setImportBody(defautlImportValue);
								setOpen(false);
							}}
							color="error"
							startIcon={<CancelIcon />}
						>
							Cancel
						</Button>
					</DialogActions>
				</FormControl>
			</Dialog>
		</>
	);
};

export default ImportTicketsModal;
