import { serverUrl } from "./serverUrl";

interface FormInput {
  type: string;
  title: string;
  description: string;
  feedback_id: string;
  user_id: string;
  }
  
  /**
   * Handles form submission by validating and processing the input data.
   * @param input FormInput
   */
export const handleSubmit = async (data: FormInput): Promise<any> => {
    
  const url = serverUrl + "/feedback"
 
    const res = await  fetch(url, {
      method: "POST",
      
      headers: {
        'Content-Type':"application/json"
      },
      body:JSON.stringify(data)
    })
    
    const result = await res.json()
   return result 
};