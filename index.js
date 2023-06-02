import app from "./app.js"


const port = 8080

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})