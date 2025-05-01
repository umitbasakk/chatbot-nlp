import user from "./assets/user.jpg";
import izuLogo from "./assets/izu.png";
import React from 'react';

function Card ({message,sender}){

    var classNameCard = "chat "
    if(sender == "system"){
        classNameCard += "incoming"
    }else{
        classNameCard += "outgoing"

    }

    return (
        <>
        <div className={classNameCard}><div class="chat-content">
                            <div className="chat-details">
                                <img src={sender == "system" ? izuLogo : user} height={70} width={300} alt="user-img" />
                                <p>{message}</p>
                            </div>
                        </div>
            </div>
        </>
    )

}

export default Card;