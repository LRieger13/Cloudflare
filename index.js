addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// list of origins allowed to make request from the API
const allowedOrigins = [
  'https://3021a05b.cloudflare-36w.pages.dev', // production first
  "http://localhost:3000" // dev env
];

// this function returns an object
const corsHeaders = origin => ({
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST',
  // specific origin allowed to make requests
  'Access-Control-Allow-Origin': origin
});

// checks given origin against the allowed origins
const checkOrigin = request => {
  const origin = request.headers.get("Origin");
  const foundOrigin = allowedOrigins.find(allowedOrigin => allowedOrigin.includes(origin));
 
  // catch the error if not on allowed origin list
  return foundOrigin ? foundOrigin : allowedOrigins[0];
  // ^ is the shorthand for below:
  /*if (foundOrigin) {
    return foundOrigin;
  } else {
    return allowedOrigins[0];
  }*/
};

const getImages = async request => {
  const {query} = await request.json();
  //fetch("URL", "OPTIONS")
  const resp = await fetch(`https://api.unsplash.com/search/photos?query=${query}`, {
    headers: {
      Authorization: `Client-ID ${CLIENT_ID}`
    }
  });

  const data = await resp.json();
  const images = data.results.map(image => ({
    id: image.id,
    image: image.urls.small,
    link: image.links.html
  }));

  const allowedOrigin = checkOrigin(request);
  return new Response(JSON.stringify(images), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(allowedOrigin)
    }
  });
}

async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    const allowedOrigin = checkOrigin(request);
    return new Response("OK", { headers: corsHeaders(allowedOrigin) });
  }

  if (request.method === "POST") {
    return getImages(request);
  }

}