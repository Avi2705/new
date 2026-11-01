import { createBrowserRouter, RouterProvider } from "react-router-dom";
const router =createBrowserRouter([
    {
        path: "/",
        element: "",
        children :[
{index: true}
        ]
    }
])
function App(){
    return (
     <RouterProvider router={router}/>     
    )
}
export default App;