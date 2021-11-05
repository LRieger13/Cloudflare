import React from 'react';
import './App.css';
import { useState } from 'react';

const getImages = async query => {
  const url = "https://my-worker.lrieger.workers.dev"

  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: { 'Content-Type': 'application/json'}
  })

  return resp.json()
}

function App() {
  const [query, setQuery] = useState('')
  const [images, setImages] = useState([])
  
  const search = async () => {
    const results = await getImages(query)
    setImages(results)
  }

  const updateQuery = evt => setQuery(evt.target.value)

  return (
    <div className="App">
      <div className="form">
        <input
          id="query"
          type="text"
          onChange={ updateQuery }
          placeholder="Search query"
        />
        {/* button will not execute search on click.
        on inspect mode the 'onClick' doesn't show up on the element */}
        <button onClick = { search }>Search</button>
      </div>
      {images.map(image =>
        <a key={image.id} href={image.link} target="_blank">
          <img src={image.image} />
        </a>
        )}
    </div>
  )
}

/*
// A function to make requests to our WorkersAPI using a query
const getImages = async query => {
  //the base URL for the API
  const url = "https://my-worker.lrieger.workers.dev/";

  const resp = await fetch(url, {
    // send a POST request
    method: "POST",
    // WITH A JSON-stringified body containing the query from our input
    body: JSON.stringify({ query }),
    // set the 'Content-Type' header
    // this is so the API knows the reques is sending JSON
    headers: { 'Content-Type': 'application/json' },
  })
  return resp.json();
}

function App() {
  // Store the query that we'll search for in a simple useState hook
  const [ query, setQuery ] = useState("");
  // Store the array of images from the API in a array
  const [ images, setImages ] = useState([]);

  // when the search button is clicked, make a request to the API
  // & set the response from it as our images array
  //const search = async () => {
//
  //}

}
*/

export default App
