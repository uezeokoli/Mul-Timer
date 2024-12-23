import { useState, useEffect } from 'react'

const App = () => {
  const [items, setItems] = useState([])
  const [item, setItem] = useState("")
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [endTimeInput, setEndTimeInput] = useState("")
  const [endTime, setEndTime] = useState("")
  const [paused, setPaused] = useState(false)

  //compute longest time
  useEffect(() => {
    if (items.length === 0) return
    // convert hours/mins into total mins then use reduce function
    // to track maximum total minutes
    const longestTime = items.reduce((max, item) => {
      const totalMinutes = item.hours * 60 + item.minutes
      return totalMinutes > max ? totalMinutes : max
    }, 0)
    //compute default end time
    const now = new Date()
    const defaultEndTime = new Date(now.getTime() + longestTime * 60 * 1000)
    //if no end time or if defaultendtime is greater than current end time
    //make defaultendtime curr endtime
    if (!endTime) {
      setEndTime(defaultEndTime)
    }
  }, [items, endTime])

  const addItem = () => {
    console.log("item: ",item)
    const itemObj = {name: item, hours: hours, minutes:minutes}
    setItems(items.concat(itemObj))
    setItem("")
  }

  const keyDownAddItem = (event) =>{
    if (event.nativeEvent.key == "Enter") {
      addItem()
    }
  }
  const changeItemInput = (event) => {
    const new_item = event.target.value
    setItem(new_item)
  }
  const changeEndInput = (event) => {
    const new_time = event.target.value
    // console.log("change end input: ", new_time)
    setEndTimeInput(new_time)
  }
  
  const confirmEndTime = () => {
    const timeString = endTimeInput.trim()
    const now = new Date()
  
    // Expecting format like "11:30 PM" or "10:15 AM"
    const parts = timeString.split(' ')
    if (parts.length !== 2) {
      window.alert("Invalid Input")
      return
    }
  
    const [timePart, ampm] = parts
    const [hourStr, minuteStr] = timePart.split(':')
  
    let hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)
  
    if (isNaN(hour) || isNaN(minute) || (ampm.toUpperCase() !== "AM" && ampm.toUpperCase() !== "PM")) {
      window.alert("Invalid Input")
      return
    }
  
    // Convert 12-hour format to 24-hour
    if (ampm.toUpperCase() === "PM" && hour < 12) {
      hour += 12
    } else if (ampm.toUpperCase() === "AM" && hour === 12) {
      hour = 0 // 12 AM is midnight (00:00 hours)
    }
  
    // Create a new Date for today with the given time
    const endTimeObject = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0,
      0
    )
  
    // Check for validity
    if (isNaN(endTimeObject.getTime())) {
      window.alert("Invalid Input")
      return
    }
  
    setEndTime(endTimeObject)
    setEndTimeInput("")
  }
  

  const addHour = () => {
    setHours(hours + 1)
  }

  const subHour = () => {
    setHours(hours - 1)
  }
  const addMinute = () => {
    if (minutes == 59){
      setMinutes(0)
      addHour()
    }
    else{
      setMinutes(minutes + 1)
    }
  }

  const subMinute = () => {
    if (minutes == 0){
      setMinutes(59)
      subHour()
    }
    else{
      setMinutes(minutes - 1)
    }
  }

  const onClickPause = () => {
    setPaused(!paused)
  }

  if (paused && endTime) {
    const newEndTime = new Date(
      endTime.getFullYear(),
      endTime.getMonth(),
      endTime.getDate(),
      endTime.getHours(),
      endTime.getMinutes(),
      endTime.getSeconds() + 1,)
    
    // setTimeout(() => console.log(console.log),1000)
    setTimeout(() => setEndTime(newEndTime) ,1000)
    
      // console.log(endTime.toString())
  }

  return (
    <div>
      <Button text ={paused? "play timer": "pause timer"} onClick={onClickPause}/>
      <CurrentTime/>
      <p>End Time: {endTime ? endTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true }): "End time not entered!"}</p>
      <Table items={items} endTime={endTime} paused={paused}/>
      {/* <InputTime text={"time required: "}/> */}
      <div>item: <input value={item} onChange={changeItemInput} onKeyDown={keyDownAddItem}/></div>
      {/* <div>time required <input value={item} onChange={changeItemInput} onKeyDown={keyDownAddItem}/></div> */}
      <InputTime text={"time required: "} hours={hours} minutes ={minutes} addHour={addHour} addMinute={addMinute} subHour={subHour} subMinute={subMinute}/>
      {/* <Button onClick={addItem}/> */}
      <Button onClick={addItem}text={"add item"}/>
      <EndInput EndTime ={endTimeInput} onChange={changeEndInput}/>
      <Button onClick={confirmEndTime} text={"confirm end time"}/>
    </div>
  )
}

const EndInput = (props) => {

  return(
    <div>
      Enter end time: <input value={props.EndTime} onChange={props.onChange} placeholder='ex: 10:30 PM'/>
    </div>
  )
}
const CurrentTime = () => {
  const now = new Date()
  const minutes_now = now.getMinutes()
  const hours_now = now.getHours()
  const [hours, setHours] = useState(hours_now)
  const [minutes, setMinutes] = useState(minutes_now)

  const formatted_time = `${hours > 12 ? hours - 12 : hours}:${minutes.toString().length == 1? `0${minutes}`:minutes} ${hours > 12 ? "PM" : "AM"}`
  setTimeout(()=> {
    const new_now = new Date()
    const minutes_now = new_now.getMinutes()
    const hours_now = new_now.getHours()
    setHours(hours_now)
    setMinutes(minutes_now)
  },60000)
  return (
      <p>Current Time: {formatted_time}</p>
  )
}

const InputTime = (props) => {
  const minutes = props.minutes
  const hours = props.hours
  return(
    <div> {props.text}
    <Button text={"+"} onClick={props.addHour}/>
    {/* <input value ={hours}key={"hours"}/> */}
    <b>{hours}</b>
    <Button text={"-"} onClick = {props.subHour}/>: 
    <Button text={"+"} onClick={props.addMinute}/>
    {/* <input value = {minutes.toString().length == 1? `0${minutes}`: minutes}key={"minutes"}/> */}
    <b>{minutes.toString().length == 1? `0${minutes}`: minutes}</b>
    <Button text={"-"} onClick={props.subMinute}/>
    </div>
  )
}
const Button  = (props) => {
  return(
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const Table = (props) => {
  // console.log("in table component",props.items)

  return(
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Timer</th>
        </tr>
        {props.items.map(item => {
          return(
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>
                <Timer hours={item.hours} minutes={item.minutes} endTime={props.endTime}/>
              </td>
            </tr>
          )
        })}
      </thead>
    </table>
  )
}
const Timer = (props) => {
  const { hours, minutes, endTime } = props

  // Total time required for this item in seconds
  const totalNeededSeconds = (hours * 60 + minutes) * 60

  // use a state for the current display of the timer
  const [display, setDisplay] = useState("")

  useEffect(() => {

    if (endTime.toString() === "Invalid Date") {
      setDisplay("No end time set")
      return
    }

    const interval = setInterval(() => {
      const now = new Date()
      const msUntilEnd = endTime - now
      const secondsUntilEnd = Math.floor(msUntilEnd / 1000)

      // If there's more time until the end than we need, it means not started yet.
      if (secondsUntilEnd > totalNeededSeconds) {
        // Not time to start counting down
        const notStartedSeconds = secondsUntilEnd - totalNeededSeconds
        const nsMinutes = Math.floor(notStartedSeconds / 60)
        const nsSeconds = notStartedSeconds % 60
        setDisplay(`Not started (starts in ${nsMinutes}:${nsSeconds.toString().padStart(2, '0')})`)
      }
      else if (secondsUntilEnd <= 0) {
        // Past the end time, timer finished
        setDisplay("Finished!")
      } else {
        // in the countdown window
        // secondsUntilEnd is how many seconds remain until endTime,
        // which should exactly match the countdown left
        const countdownMinutes = Math.floor(secondsUntilEnd / 60)
        const countdownSeconds = secondsUntilEnd % 60
        setDisplay(`${countdownMinutes}:${countdownSeconds.toString().padStart(2, '0')}`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endTime, hours, minutes, totalNeededSeconds])

  return <p>{display}</p>
}

export default App
