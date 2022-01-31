import Modal from "../common/components/Modal";
import {useDropzone} from "react-dropzone";
import {useCallback} from "react";
import {MdAddPhotoAlternate as AddPhotoIcon} from "react-icons/md";
import {combineClassnames} from "../common/utils";

export default function ImageSelectModal({openState, setImage, imageSources, headerText}) {
	const images = imageSources;
	const onDrop = useCallback(
		(/** @type{File[]} */ acceptedFiles) => {
			if (!acceptedFiles.length) {
				return;
			}
			const reader = new FileReader();
			reader.onabort = () => console.log("file reading was aborted");
			reader.onerror = (err) => console.error("file reading has failed", err);
			reader.onload = () => {
				openState.toggle();
				setImage(reader.result);
			};
			reader.readAsDataURL(acceptedFiles[0]);
		},
		[setImage, openState.toggle]
	);
	const {getRootProps, getInputProps} = useDropzone({onDrop});
	const imageSizeStyle = {
		height: 125,
		width: 200,
	};
	const imageClassName = "w-100 h-100 border-4 border-gray-700 hover:border-blue-300";

	return (
		<Modal
			title={headerText}
			closeLabel="Cancel"
			onClose={openState.toggle}
			isOpen={openState.isOpen}
			contentLabel="Settings Modal"
		>
			<div className="flex-1 w-full">
				<div className="grid grid-cols-4 gap-4 w-full p-8">
					{images.map((src, index) => (
						<div
							key={index}
							className="h-36"
							onClick={() => {
								openState.toggle();
								setImage(src);
							}}
						>
							<img style={imageSizeStyle} className={imageClassName} src={src} />
						</div>
					))}
					<div className="h-36 cursor-pointer" title="Add new image">
						<div
							{...getRootProps()}
							style={imageSizeStyle}
							className={combineClassnames(imageClassName, `flex justify-center items-center`)}
						>
							<input {...getInputProps()} />
							<AddPhotoIcon className="flex-1 text-5xl" />
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
}
