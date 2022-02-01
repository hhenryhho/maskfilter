/** @format */

import { Flex, Select } from '@chakra-ui/react'
import React, { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import * as tf from '@tensorflow/tfjs'
import * as facemesh from '@tensorflow-models/face-landmarks-detection'
import { drawMesh, drawDefi } from './util/filters'

const Mask = () => {
	const webcamRef = useRef(null)
	const canvasRef = useRef(null)
	const [value, setValue] = useState('0')
	// I'm dumb so I need another reference to check change in value state
	const reference = useRef()
	reference.current = value

	//  Load posenet
	const runFacemesh = async () => {
		const net = await facemesh.load(
			facemesh.SupportedPackages.mediapipeFacemesh
		)
		if (
			typeof webcamRef.current !== 'undefined' &&
			webcamRef.current !== null &&
			webcamRef.current.video.readyState === 4
		) {
			// Get Video Properties
			const videoWidth = webcamRef.current.video.videoWidth
			const videoHeight = webcamRef.current.video.videoHeight

			// Set video width
			webcamRef.current.video.width = videoWidth
			webcamRef.current.video.height = videoHeight

			// Set canvas width
			canvasRef.current.width = videoWidth
			canvasRef.current.height = videoHeight
		}

		// Set loop to infinitely check
		setInterval(() => {
			detect(net)
		}, 100)
	}

	const detect = async (net) => {
		// Make Detections
		const face = await net.estimateFaces({
			input: webcamRef.current.video,
		})

		// Get canvas context
		const ctx = canvasRef.current.getContext('2d')

		// Clear anything currently on canvas
		ctx.clearRect(
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		)
		// Rotate between masks
		switch (reference.current) {
			case '0':
				drawMesh(face, ctx)
				break
			case '1':
				drawDefi(face, ctx)
				break
		}
	}

	return (
		<Flex
			h='100vh'
			align='center'
			justify='center'
			flexDir='column'>
			<Webcam
				ref={webcamRef}
				onLoadedData={runFacemesh}
				style={{
					position: 'absolute',
					marginLeft: 'auto',
					marginRight: 'auto',
					left: 0,
					right: 0,
					textAlign: 'center',
					zindex: 9,
					width: 640,
					height: 480,
				}}
			/>
			<canvas
				ref={canvasRef}
				style={{
					position: 'absolute',
					marginLeft: 'auto',
					marginRight: 'auto',
					left: 0,
					right: 0,
					textAlign: 'center',
					zindex: 9,
					width: 640,
					height: 480,
				}}
			/>
			<Select
				mt='600'
				onChange={(e) => {
					setValue(e.target.value)
				}}
				value={value}>
				<option value='1'>Defi Frens</option>
				<option value='0'>Mesh</option>
			</Select>
		</Flex>
	)
}

export default Mask
