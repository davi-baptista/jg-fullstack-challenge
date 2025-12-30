import { io } from 'socket.io-client'

const socket = io('http://localhost:3001/notifications', {
  auth: {
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MTBiMjcyNy1jZjkzLTQ4N2ItOTYxZS1iNjJjNmU4MmQ1ZWQiLCJpYXQiOjE3NjcwMjU4MzAsImV4cCI6MTc2NzExMjIzMH0.IV_7JnIDUdo9lKrE6ewQV3Lzf-Va3TQ0lpuu8QwE4Qkzgm6L9Pa5pPrMJ0_bSuo0b56zMjPpw4hcEgdfCcTbaRALBUq92v00QcfTBSjji7egXHUIAO2rvHRNZjYlHyKe3L479F8hciJO-V3mRZ0Sa_AxBObZm6T3lc-P1rLd7trQZo8H6L46UKsTqbCM-eQsGDzoY8p21p09eag1nD-nBC-G6xk1Dywdeo8gDW_28Zp0h1a6pe4UaghMDdkgwEzavKuo5wS3dQZQTByuNotzwPuwZF0Y-QvsttwCtCH0sDrqUe1Zq81umAAEqKQD5Q5aqubWfluMOy5p9eozo3VEgQ',
  },
})

socket.on('connect', () => {
  console.log('connected', socket.id)
})

socket.on('notification', data => {
  console.log('WS notification:', data)
})

socket.on('disconnect', () => {
  console.log('disconnected')
})

socket.on('connect_error', err => {
  console.error('connect_error:', err.message)
})
