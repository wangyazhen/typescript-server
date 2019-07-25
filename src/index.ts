import App from './app'


const port = process.env.PORT || 3000

App.listen(port, err => {
  if (err) {
    return console.log(err)
  }
  console.log(`server is listening on ${port}`)
})
