import { useState } from 'react'

function App() {
  const [items, setItems] = useState([])
  const [item, setItem] = useState("")
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  
  const addItem = () => {
    console.log(item)
    setItems(items.concat(item))
    setItem("")
  }

  const keyDownAddItem = (event) =>{
    if (event.nativeEvent.key == "Enter") {
      addItem()
    }
  }
  const changeInput = (event) => {
    const new_item = event.target.value
    setItem(new_item)
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
      <Table items={items}/>
      {/* <InputTime text={"time required: "}/> */}
      <div>item: <input value={item} onChange={changeInput} onKeyDown={keyDownAddItem}/></div>
      {/* <div>time required <input value={item} onChange={changeInput} onKeyDown={keyDownAddItem}/></div> */}
      <InputTime text={"time required: "} hours={hours} minutes ={minutes} addHour={addHour} addMinute={addMinute} subHour={subHour} subMinute={subMinute}/>
      {/* <Button onClick={addItem}/> */}
      <Button onClick={addItem}text={"add item"}/>
    </div>
  )
}

const InputTime = (props) => {
  const minutes = props.minutes
  const hours = props.hours
  return(
    <div> {props.text}
    <Button text={"+"} onClick={props.addHour}/>
    <input value ={hours}key={"hours"}/>
    <Button text={"-"} onClick = {props.subHour}/>: <Button text={"+"} onClick={props.addMinute}/><input value = {minutes}key={"minutes"}/><Button text={"-"} onClick={props.subMinute}/>
    </div>
  )
}
const Button  = (props) => {
  return(
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const Table = (props) => {
  console.log("in table component",props.items)
  return(
    <table>
      <thead>
        <tr>
          <th>item</th>
          <th>timer</th>
          <th>ends</th>
        </tr>
        {props.items.map(item => {
          return(
            <tr key={item}>
              <td >{item}</td>
              <td><Timer/></td>
            </tr>
          )
        })}
      </thead>
    </table>
  )
}
const Timer = (props) => {
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(0)

  if (seconds == 59){
    setTimeout(() => setSeconds(0), 1000)
    setTimeout(() => setMinutes(minutes + 1), 1000)
  }
  else {
    setTimeout(() => setSeconds(seconds + 1), 1000)
  }

  return(
    <p>{minutes}: {(seconds.toString().length == 1? "0": "")}{seconds}</p>
  )
}

export default App
