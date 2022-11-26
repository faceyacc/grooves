import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getCurrentUserProfile, logout} from '../spotify';

const Profile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {    
        const fetchData = async () => {
          //  Pull in user data
          const { data } = await getCurrentUserProfile();
          setProfile(data);
        };
        
        catchErrors(fetchData());
      }, []);

      return (
        <>
            {profile && (
                <div>
                    <h1>{ profile.display_name }</h1>
                    <p>{ profile.followers.total } followers </p>
                    {profile.images.length && profile.images[0].url && (
                        <img src={profile.images[0].url} alt="Avatoar"/>
                    )}
                </div>
            )}
        </>
      )
};

export default Profile;
