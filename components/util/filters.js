/** @format */

// Drawing Mesh
export const drawDefi = (predictions, ctx) => {
	const image = new Image()
	// Load an image of intrinsic size 300x227 in CSS pixels
	image.src = '/fren.png'

	if (predictions.length > 0) {
		// For each face
		predictions.forEach((prediction) => {
			const keypoints = prediction.scaledMesh
			// Draw Dots
			const x = keypoints[54][0]
			const y = keypoints[54][1]

			ctx.drawImage(image, x - 80, y - 130, 300, 300)
		})
	}
}

export const drawMesh = (predictions, ctx) => {
	if (predictions.length > 0) {
		predictions.forEach((prediction) => {
			const keypoints = prediction.scaledMesh

			// Draw Dots
			for (let i = 0; i < keypoints.length; i++) {
				const x = keypoints[i][0]
				const y = keypoints[i][1]

				ctx.beginPath()
				ctx.arc(x, y, 1 /* radius */, 0, 3 * Math.PI)
				ctx.fillStyle = 'aqua'
				ctx.fill()
			}
		})
	}
}
