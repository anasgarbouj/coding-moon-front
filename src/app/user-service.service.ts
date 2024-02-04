import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable , throwError} from 'rxjs';
import { environment } from '../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
interface LogoResponse {
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient, private router: Router) {}
  public isTokenExpired(): boolean {
    const token = localStorage.getItem('jwtToken');
    if (!token) return true;
  
    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
     
      const exp = decodedToken.exp; // Get the expiration time from the token
  
      if (!exp) return false;
  
      return (Date.now() >= exp * 1000); // Compare the expiration time with the current time
    } catch (error) {
     
      return true;
    }
  }

  // Call this method to check if the user should be logged out
  public checkTokenAndLogout(): void {
    if (this.isTokenExpired()) {
      // Token has expired
      this.logout();
    }
  }
  public logout(): void {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/s']); 
 
  }
  // Helper method to get HTTP headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken'); 
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Signup
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/user/new`, userData);
  }

  signin(email: string, password: string): Observable<any> {
    const signInData = {
      email: email,
      password: password
    };
  
    return this.http.post(`${this.apiUrl}/api/user/signin`, signInData);
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

 // Forgot Password
forgotPassword(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/user/reset/forgotpassword`, { email }, {
    headers: this.getHeaders(),
    responseType: 'text'  // Expect a text response
  })
  .pipe(
    map(responseText => {
      try {
        // Attempt to manually parse the response text to JSON
        const jsonResponse = JSON.parse(responseText);
        return jsonResponse;
      } catch (error) {
        // If parsing fails but the response contains a known success message
        if(responseText.includes("Request sended successfully")) {
          return { message: 'Request sent successfully' };
        }
        // If parsing fails and no success message, log the error and return the original response text
      
        return responseText;
      }
    }),
    catchError(error => {
      // Handle any HTTP errors here
      return throwError(error);
    })
  );
}
deleteLeader(): Observable<any> {
  // Assuming the endpoint to delete a leader does not require any additional
  // path parameters or body payload, and it uses the JWT token for authorization
  return this.http.delete(`${this.apiUrl}/api/auth/jwt/leader`, { headers: this.getHeaders() })
    .pipe(
      catchError(error => {
        // Handle any HTTP errors here
        return throwError(error);
      })
    );
}


  // Reset Password
  resetPassword(newPassword: string, confirmPassword: string, token: string): Observable<any> {
    const resetData = {
      password: newPassword,
      passwordConfirm: confirmPassword,
    };
  
    // Create a copy of the headers and append the token
    const headersWithToken = this.getHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.patch(`${this.apiUrl}/api/user/reset/resetpassword`, resetData, {
      headers: headersWithToken
    }).pipe(
      catchError(error => {
        // Handle any HTTP errors here  
        return throwError(error);
      })
    );
  }
  
  

  createTeam(teamData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/jwt/new`, teamData, { headers: this.getHeaders(), responseType: 'text' })
      .pipe(
        map(responseText => {
          try {
            // Attempt to manually parse the response text to JSON
            return JSON.parse(responseText);
          } catch (error) {
            // If parsing fails, log the error and return the original response text
          
            return responseText;
          }
        }),
        catchError(error => {
          // Handle any HTTP errors here
          return throwError(error);
        })
      );
  }

  // Get Team
  getTeam(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/auth/jwt/squad/id`, { headers: this.getHeaders() });
  }

  // Get User
  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/user/jwt/id`, { headers: this.getHeaders() });
  }
  getUserById(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/user/jwt/${userId}`, { headers: this.getHeaders() })
     
  }
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/user/jwt/${userId}`, { headers: this.getHeaders() });
  }

 
 // Update Team
updateTeam(squadName: string): Observable<any> {
  const updateData = {
    Name: squadName // Assuming your backend expects a 'squadName' field for the update
  };

  return this.http.patch(`${this.apiUrl}/api/auth/jwt/update`, updateData, {
    headers: this.getHeaders()
  }).pipe(
    map(response => {
      // If the response is already in JSON format, you can directly return it
      return response;
    }),
    catchError(error => {
      // Handle any HTTP errors here
      return throwError(error);
    })
  );
}
// Update Team Logo
// In UserService
updateTeamLogo(formData: FormData): Observable<any> {
  // Note: The URL here is generic; adjust it according to your API's endpoint for updating the team logo
  return this.http.patch(`${this.apiUrl}/api/auth/jwt/update/logo`, formData, {
    headers: this.getHeaders().delete('Content-Type'), // Important: Allow the browser to set Content-Type for FormData with boundary
    observe: 'response'
  }).pipe(
    map(response => {
      return response.body; // Adjust based on your API's response
    }),
    catchError(error => {
      return throwError(error);
    })
  );
}
getTeamLogo(): Observable<LogoResponse> {
  return this.http.get<LogoResponse>(`${this.apiUrl}/api/auth/jwt/squad/logo`, {
    headers: this.getHeaders(), // Assuming getHeaders() returns HttpHeaders
    responseType: 'json' // This tells HttpClient to parse the response as JSON
  }).pipe(
    catchError(error => {
   
      return throwError(error);
    })
  );
}




  // Delete User
  deleteTeam(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/auth/jwt/delete`, { headers: this.getHeaders() });
  }
  verifyEmailCode(verifyCode: string, email: string): Observable<any> {
    const payload = {
      verif_code: verifyCode // Ensure this matches the JSON field name expected by the backend
    };
    return this.http.post(`${this.apiUrl}/api/user/verify/${email}`, payload);
  }
  
  
  
  
  addUserToTeam(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/jwt/add`, userData, {
      headers: this.getHeaders(),
      responseType: 'text'  // Expect a text response
    })
    .pipe(
      map(responseText => {
        try {
          // Attempt to manually parse the response text to JSON
          const jsonResponse = JSON.parse(responseText);
          return jsonResponse;
        } catch (error) {
          // If parsing fails but the response contains a success message
          if(responseText.includes("member added successfully")) {
            return { message: 'Member added successfully' };
          }
          // If parsing fails and no success message, throw an error
          throw new Error('Error parsing response');
        }
      }),
      catchError(error => {
        // Handle any HTTP errors here
        return throwError(error);
      })
    );
  }
  
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/jwt/image`, formData, {
      headers: this.getHeaders(), // Ensure this method does not set Content-Type explicitly for this call
      responseType: 'text'
    }).pipe(
      map(responseText => {
        try {
          // Attempt to manually parse the response text to JSON
          return JSON.parse(responseText);
        } catch (error) {
          // If parsing fails, log the error and return the original response text
         
          return responseText;
        }
      }),
      catchError(error => {
        // Handle any HTTP errors here
        return throwError(error);
      })
    );
    }    
  
    /**
     * Uploads a file to the server.
     * @param fileData - The file to be uploaded.
     * @returns An Observable with the server's response.
     */
    uploadFile(fileData: File): Observable<any> {
      const formData = new FormData();
      formData.append('file', fileData);
  
      return this.http.post(`${this.apiUrl}/api/auth/jwt/file`, formData, {
        headers: this.getHeaders(),
        responseType: 'text' 
      })
      .pipe(
        map(responseText => {
          try {
            return JSON.parse(responseText);
          } catch (error) {
           
            return responseText;
          }
        }),
        catchError(error => {
          // Handle any HTTP errors here
          return throwError(error);
        })
      );
    }
 /**
     * Uploads a file to the server.
     * @param fileData - The file to be uploaded.
     * @returns An Observable with the server's response.
     */
    uploadFile2(fileData: File, email: string): Observable<any> {
      const formFile = new FormData();
      formFile.append('file', fileData);
    
    
      return this.http.post(`${this.apiUrl}/api/user/file/${email}`, formFile ,{
       
        responseType: 'text' 
      })
       .pipe(
        map(responseText => {
          try {
            return JSON.parse(responseText);
          } catch (error) {
            
            return responseText;
          }
        }),
        catchError(error => {
          // Handle any HTTP errors here
          return throwError(error);
        })
      );
    }
     
    
}
