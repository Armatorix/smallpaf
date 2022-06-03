import './App.css';
import { ENDPOINT } from "./config.js"
import { FormControl, InputLabel, Input, FormHelperText, Button } from "@mui/material"
function App() {
  return (
    <div className="App">
      <header className="App-header">
        SmallPAF
      </header>

      <form onSubmit={(e) => {
        e.preventDefault();

        fetch(ENDPOINT + "/auth/token", {
          body: JSON.stringify({ email: e.target.email.value }),
          cache: 'no-cache',
          headers: {
            'content-type': 'application/json'
          },
          method: 'POST',
          mode: 'cors',
          redirect: 'follow',
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (myJson) {
            console.log(myJson);
          });
        // TODO redirect on success
      }}>
        <FormControl >
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" aria-describedby="email-helper" required />
          <FormHelperText id="email-helper"></FormHelperText>
          <Button type="submit">
            Send auth email
          </Button>
        </FormControl>
      </form>
    </div>
  );
}

export default App; 
