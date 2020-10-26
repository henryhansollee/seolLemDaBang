import React, { useState } from 'react';

// Header
import HeaderComp from '../../components/base/HeaderComp';

// Axios
import axios from 'axios';

// CSS
import './SignupPage.css';

// Audio Record
import { ReactMic } from 'react-mic';

// Audio Player
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

// Material-UI
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// History
import { useHistory } from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['기본 정보', '사진 입력', '목소리 녹음'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown step';
  }
}

const locations = [
  '서울',
  '경기',
  '인천',
  '강원',
  '대전',
  '세종',
  '충남',
  '충북',
  '부산',
  '울산',
  '경남',
  '경북',
  '대구',
  '전남',
  '전북',
  '제주',
  '광주',
];

const genders = [
  '남자',
  '여자',
];

const SignupPage = () => {
  const history = useHistory();

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordconfirm, setPasswordconfirm ] = useState('');
  const [ nickname, setNickname ] = useState('');
  const [ gender, setGender ] = useState('');
  const [ age, setAge ] = useState('');
  const [ location, setLocation ] = useState('');
  const [ image, setImage ] = useState('');
  const [ record, setRecord ] = useState(false);
  const [ voice, setVoice ] = useState('');
  const [ voiceurl, setVoiceurl ] = useState('');

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const setEmailText = e => {
    setEmail(e.target.value);
  };
  const setPasswordText = e => {
    setPassword(e.target.value);
  };
  const setPasswordconfirmText = e => {
    setPasswordconfirm(e.target.value);
  };
  const setNicknameText = e => {
    setNickname(e.target.value);
  };
  const setGenderText = e => {
    setGender(e.target.value);
  };
  const setAgeText = e => {
    setAge(e.target.value);
  };
  const setLocationText = e => {
    setLocation(e.target.value);
  };
  const setImageText = e => {
    setImage(e.target.value);
  };
  const startRecording = () => {
    setRecord(true);
  };
  const stopRecording = () => {
    setRecord(false)
  };
  const onStop = (recordedBlob) => {
    console.log(recordedBlob);
    setVoice(recordedBlob.blob);
    setVoiceurl(recordedBlob.blobURL);
  };
  const removeRecord = () => {
    setVoice('');
    setVoiceurl('');
  };
  const sendSignupData = e => {
    e.preventDefault();
    
    if (password === passwordconfirm) {
      const signupData = { email, password, nickname, gender, age, location, image, voice };
      console.log(signupData, '회원가입 정보')
      axios.post('/signup/', signupData)
        .then(() => {
          console.log('회원가입 성공')
          history.push('/login')
        })
        .catch((error) => console.log(error))
    } else {
      alert('비밀번호를 확인하세요.')
    }
  };

  return (
    <div>
      <HeaderComp />
      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = <Typography variant="caption">Optional</Typography>;
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          {activeStep === 0 && (
            <div>
              <h6>기본정보</h6>
              <Input
                className="signup-input"
                placeholder="닉네임"
                nickname={nickname}
                onChange={setNicknameText}
              />
              <Input
                className="signup-input"
                placeholder="이메일"
                email={email}
                onChange={setEmailText}
              />
              <Input
                className="signup-input"
                type="password"
                placeholder="비밀번호"
                password={password}
                onChange={setPasswordText}
              />
              <Input
                className="signup-input"
                type="password"
                placeholder="비밀번호 확인"
                passwordconfirm={passwordconfirm}
                onChange={setPasswordconfirmText}
              />
              <h6>상세정보</h6>
              <div className="gender-and-age">
                <FormControl className="w-25">
                  <InputLabel id="demo-mutiple-name-label1">성별</InputLabel>
                  <Select
                    labelId="demo-mutiple-name-label1"
                    id="demo-mutiple-name1"
                    value={gender}
                    onChange={setGenderText}
                    input={<Input />}
                  >
                    {genders.map((gender) => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <TextField
                    id="date"
                    label="생년월일"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    age={age}
                    onChange={setAgeText}
                  />
                </FormControl>
              </div>
                      
              <FormControl>
                <InputLabel id="demo-mutiple-name-label">지역</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  value={location}
                  onChange={setLocationText}
                  input={<Input />}
                  MenuProps={MenuProps}
                >
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>
            </div>
          )}
          {activeStep === 1 && (
            <div>
              <h6>사진</h6>
              <InputLabel className="mt-3">프로필 사진</InputLabel>
              <Input
                className="signup-input"
                type="file"
                onChange={setImageText}
              />
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>
            </div>
          )}
          {activeStep === 2 && (
            <div>
              <h6>녹음</h6>
              {!voice && (
                <div>
                  <InputLabel className="mt-3">음성 녹음</InputLabel>
                  <ReactMic
                    record={record}
                    className="sound-wave w-100"
                    onStop={onStop}
                    strokeColor="black"
                    backgroundColor="lightgray" />
                  <div>
                    <button onClick={startRecording} type="button">녹음시작</button>
                    <button onClick={stopRecording} type="button">녹음종료</button>
                  </div>
                </div>
              )}

              {voice && (
                <div>
                  <AudioPlayer
                    src={voiceurl}
                    showJumpControls={false}
                    customVolumeControls={[]}
                    customAdditionalControls={[]}
                  />
                  <button 
                    onClick={removeRecord}
                    type="button"
                  >
                    다시녹음
                  </button>
                </div>
              )}
              <form
                onSubmit={sendSignupData}
                className="signup-form"
              >
                <button
                  className="signup-button"
                  type="submit"
                >
                  회원가입
                </button>
              </form>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Finish
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;