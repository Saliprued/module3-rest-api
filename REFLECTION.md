# Reflection
This was my first time connecting React to an API on my own. The connection was not too difficult, but I needed to understand how to organize the code, especially in App.jsx


## Request Journey
When the page opens, React sends a GET request to FastAPI to load the ideas. When I save a new idea, the form sends its title and category through a POST request. The API returns the created idea with its ID, and React displays it on the board.

## Props vs state
State stores information that changes, such as the form values, ideas, and loading messages. Props pass information between components. In my application, App.jsx manages the list and requests, passes ideas to IdeaList, and gives IdeaForm a callback to save an idea. This structure helped me understand each component’s responsibility.

## Frontend vs Backend test
The frontend checks the title before sending a request and gives quick feedback. The backend must also check it because someone can send a request directly through Postman. Both must reject empty or spaces-only titles.

## One bug I fixed
When I clicked Save, the console showed “onAddIdea is not a function.” The form was using a different callback name from the one passed by App.jsx. The fix was to use onCreate consistently. I learned that callback prop names must match.

## Refresh vs Backend restart
When I clicked Save, the console showed “onAddIdea is not a function.” The form was using a different callback name from the one passed by App.jsx. The fix was to use onCreate consistently. I learned that callback prop names must match.

