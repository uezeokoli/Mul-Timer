import { useState } from 'react'

function App() {
  const [items, setItems] = useState([])
  const [item, setItem] = useState("")
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [endTimeInput, setEndTimeInput] = useState("")
  const [endTime, setEndTime] = useState("")
  
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
    const timeString = endTimeInput
    const now = new Date()
    const now_string = now.toISOString().split('T')[0] // YYYY-MM-DD

    const endTimeString = `${now_string} ${timeString}`
    const endTimeObject = new Date(endTimeString)
    
    if (endTimeObject == "Invalid Date" ){
      // console.log("works!")
      window.alert("Invalid Input")
    }
    else{
      setEndTime(endTimeObject)
      setEndTimeInput("")
    }
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
  return (
    <div>
      <CurrentTime/>
      <p>End Time: {endTime ? endTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true }): "End time not entered!"}</p>
      <Table items={items}/>
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
          <th>item</th>
          <th>timer</th>
        </tr>
        {props.items.map(item => {
          return(
            <tr key={item.name}>
              <td >{item.name}</td>
              <td><Timer hours={item.hours} minutes={item.minutes}/></td>
            </tr>
          )
        })}
      </thead>
    </table>
  )
}
const Timer = (props) => {
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(((props.hours * 60) + (props.minutes)))

  if (seconds == 0 && minutes == 0){
    return <p>Finished!</p>
  }
  else if (seconds == 0){
    setTimeout(() => setSeconds(59), 1000)
    setTimeout(() => setMinutes(minutes - 1), 1000)
  }
  else {
    setTimeout(() => setSeconds(seconds - 1), 1000)
  }

  return(
    <p>{minutes}: {(seconds.toString().length == 1? "0": "")}{seconds}</p>
  )
}

export default App
