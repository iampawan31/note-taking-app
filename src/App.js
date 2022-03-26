import { useState, useEffect } from 'react'

const App = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const sr = new Recognition()

  useEffect(() => {
    sr.continuous = true
    sr.interimResults = true

    sr.onstart = () => {
      console.log('VR Started')
      setIsRecording(true)
    }

    sr.onend = () => {
      console.log('VR Stopped')
      setIsRecording(false)
    }

    sr.onresult = (event) => {
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]

        if (result.isFinal) checkForCommand(result)
      }

      setTranscript(
        Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('')
      )
    }

    // sr.start()
    // setIsRecording(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleMic = () => {
    if (isRecording) {
      sr.stop()
      setIsRecording(false)
    } else {
      sr.start()
      setIsRecording(true)
    }
  }

  const checkForCommand = (result) => {
    const t = result[0].transcript

    if (t.includes('stop recording')) {
      sr.stop()
    } else if (
      t.includes('what is the time') ||
      t.includes("what's the time")
    ) {
      sr.stop()
      console.log(new Date().getTime())
      setTimeout(() => {
        sr.start()
      }, 100)
    }
  }

  return (
    <div className="flex h-screen items-center flex-col mx-10">
      <div className="h-1/4 flex items-center justify-center">
        <div>
          <button
            className="bg-black text-white px-1 w-24 rounded shadow py-2"
            onClick={toggleMic}
          >
            {isRecording ? 'Stop' : 'Record'}
          </button>
        </div>
      </div>
      <div className="h-2/4 p-2 text-3xl w-full border-4 mx-4 border-black">
        {transcript}
      </div>
    </div>
  )
}

export default App
