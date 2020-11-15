import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useHistory } from "react-router-dom";

import './QuestionListPage.css';
//Footer
import FooterComp from '../../components/base/FooterComp';
const QuestionListPage = () => {
  const history = useHistory();
  const [ exam, setExam ] = useState(null);
  const [ isExam, setIsExam ] = useState(false);
  const [cookies, setCookie] = useCookies(['accessToken']);
  const config = {
    headers: { 'Authorization':'Bearer '+ cookies.accessToken } 
  }
  const [ nickname, setNickname ] = useState('')
  useEffect(() => {
      const fetchData = async() => {
        setIsExam(true);
        try {
          // const getQuestions = () => {
          //   axios.get(`/question/list`,config)
          //   .then((response) => {
          //     if(response.data.length>0){
          //       console.log("뭔가 있음");
          //       setExam(response.data);
          //       const exam = response.data.map((question, idx) => {
          //         return {
          //           id:question.questionId,
          //           content:question.content,
          //           answer:question.correctAnswer,
          //           user_id:question.user.id,
          //           user_nickname:question.user.nickname,
          //         };
          //       })
          //       console.log(exam,'??')
          //       setExam(exam)
          //       setIsExam(true)
          //       console.log(questions,'zzz')
          //     }else{
          //       console.log('시험지 없뜜')
          //       setIsExam(false)
          //     }
          //   })
          //   .catch((err) => {
          //     console.log(err)
          //     })
          // }
          const getExam = await axios.get(`/question/list`,config);
          if(getExam.data.length>0){
            console.log(getExam.data,'??')
            setExam(getExam.data)
            setIsExam(true)
          }else{
            setIsExam(false)
          }
        } catch(e) {
          console.log(e);
        } 
        setIsExam(false);
      };
      fetchData();
      //유저 정보 가져오기  
      axios.get('/api/my-profile', config)
      .then((response) => {
        setNickname(response.data.nickname)
      })
  }, []);

  if(isExam){
    return <div>대기중</div>
  }

  if(!exam){
    return (
      <div style={{display:"flex", justifyContent:"center", 
      margin:"250px auto"}}>
        <Link to="/question/create"
          className="exam-create-btn">시험지+</Link>
      </div>
    )
  }

  return (
    <div style={{display:"flex", justifyContent:"center"}}>
    <div className="quest-list-box">
      <div style={{display:"flex", flexDirection:"column", 
      alignItems:"center"}}>
        <div className="stepper-final-box-comp">
          <div className="stepper-exam-preview">
            <div style={{fontSize:"17px", marginBottom:"5px",}}>{nickname}님의 청춘을 위한</div>
            <h4>이상형 레시피</h4>
            <div style={{height:"7.5px", width:"96%", 
            backgroundColor:"#5e1e27"}}></div>
            <hr style={{height:"0.6px", width:"96%", 
            backgroundColor:"#5e1e27", marginTop:"2px",}}></hr>
            
            {exam.map((item) => (
            <div className="create-final-box" key={item.questionId}>
              <div key={item.questionId} className="quest-box">
                <label className="create-final-label">{exam.indexOf(item)+1}번</label>
                <div className="create-final-quest">{item.content}</div>
              </div>
              <div className="create-final-ans-box">
                <div className="create-final-label">정답: </div>
                {item.correctAnswer 
                ?
                <div className="create-final-ans">
                  예
                </div> 
                :
                <div className="create-final-ans">
                  아니오
                </div>}
              </div>
            </div>
          ))}
          </div>
        
          <div className="stepper-btn">
            <Link to="/question/detail">
              <button className="exam-update-btn">편집</button>
            </Link>
          </div>
        </div>
      </div>
      {/* <FooterComp/> */}
    </div>
    </div>
  );
  };
  
  export default QuestionListPage;