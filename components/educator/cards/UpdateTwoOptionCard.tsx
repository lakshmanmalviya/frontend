import { buttonStyle } from '@/styles/CommonStyle.module';
import { Option, Question } from '@/types/types';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, FormEvent, useState } from 'react';

interface UpdateTwoOptionCardProps {
  handleUpdateQuestion: (question: Question) => void;
  onClose: () => void;
  question: Question;
  index: number;
}

const UpdateTwoOptionCard: React.FC<UpdateTwoOptionCardProps> = ({ index, question, handleUpdateQuestion, onClose }) => {
  const [correctOption, setCorrectOption] = useState<string>('option1');
  const [randomize, setRandomize] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[]>([...question.options]);
  const [editQuestion, setEditQuestion] = useState<Question>({ ...question });

  const handleOptionChange = (index: number) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text: e.target.value };
    setOptions(newOptions);
  };

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditQuestion((prevQuestion) => ({ ...prevQuestion, [name]: value }));
  };

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedOptions = options.map((option: Option, index: number) => ({
      ...option,
      isCorrect: `option${index + 1}` === correctOption
    }));

    handleUpdateQuestion({ ...editQuestion, randomizeOptions: randomize, options: updatedOptions });
  };


  const handleQuestionAndOptionPictureChange = (event: ChangeEvent<HTMLInputElement>, name: string, index: number) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      convertImageToBase64String(file, name, index);
    }
  };

  const convertImageToBase64String = (file: File, name: string, index: number) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = (reader.result as string).replace('jpeg', 'png');
      if (name == 'question') {
        setEditQuestion((prevData) => ({
          ...prevData,
          questionPic: result,
        }));
      }
      if (name === 'option' && index >= 0) {
        setOptions((prevOptions) => {
          const newOptions = [...prevOptions];
          newOptions[index] = { ...newOptions[index], optionPic: result };
          return newOptions;
        });
      }
    }
    reader.readAsDataURL(file);
  };

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 600,
        margin: 'auto',
        backgroundColor: 'white',
        marginTop: '5px'
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Edit Question {index}
      </Typography>
      <form onSubmit={handleAdd} autoComplete="off">
        <TextField
          name="text"
          label="Question"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editQuestion.text}
          onChange={handleQuestionChange}
          error={Boolean(editQuestion.text.trim().length < 3)}
          helperText='Please enter the text of the question min 3 character'
        />
        <Box display="flex" alignItems="center" justifyContent={'center'} mt={1} mb={1}>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="question-pic-upload"
            onChange={(e) => handleQuestionAndOptionPictureChange(e, 'question', -1)}
          />
          <label htmlFor="question-pic-upload">
            <img
              src={editQuestion.questionPic}
              style={{ maxWidth: '500px', maxHeight: '150px', margin: 'auto', border: '3px solid white' }}
            />
          </label>
        </Box>

        <TextField
          name="maxScore"
          label="Marks"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editQuestion.maxScore}
          onChange={handleQuestionChange}
          error={Boolean(editQuestion.maxScore < 1 || editQuestion.maxScore > 10)}
          helperText='Please enter the marks at least 1 and max 10'
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="option1"
              label="Option 1"
              variant="outlined"
              fullWidth
              margin="normal"
              value={options[0].text}
              onChange={handleOptionChange(0)}
            />
            <Box display="flex" alignItems="center" justifyContent={'center'} mt={1} mb={1}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="option1-pic-upload"
                onChange={(e) => handleQuestionAndOptionPictureChange(e, 'option', 0)}
              />
              <label htmlFor="option1-pic-upload">
                <img
                  src={options[0].optionPic}
                  style={{ maxWidth: '500px', maxHeight: '150px', margin: 'auto', border: '3px solid white' }}
                />
              </label>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="option2"
              label="Option 2"
              variant="outlined"
              fullWidth
              margin="normal"
              value={options[1].text}
              onChange={handleOptionChange(1)}
            />
            <Box display="flex" alignItems="center" justifyContent={'center'} mt={1} mb={1}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="option2-pic-upload"
                onChange={(e) => handleQuestionAndOptionPictureChange(e, 'option', 1)}
              />
              <label htmlFor="option2-pic-upload">
                <img
                  src={options[1].optionPic}
                  style={{ maxWidth: '500px', maxHeight: '150px', margin: 'auto', border: '3px solid white' }}
                />
              </label>
            </Box>
          </Grid>
        </Grid>

        <FormControl component="fieldset" sx={{ mt: 2 }} style={{ display: 'flex' }}>
          <FormLabel component="legend" id="option-selectable">Correct Option</FormLabel>
          <Select
            id="option-selectable"
            name="correctOption"
            required
            value={correctOption}
            label="Correct Option"
            onChange={(e) => setCorrectOption(e.target.value)}
          >
            <MenuItem value="option1">Option 1 </MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={randomize}
              onChange={(e) => setRandomize(e.target.checked)}
              color="primary"
            />
          }
          label="Randomize Options"
          sx={{ mt: 2 }}
        />
        <Box mt={2}>
          <div style={buttonStyle}>
            <Button variant="contained" color="primary" sx={{ fontSize: '14px' }}
              type='submit'
            >
              Update
            </Button>
            <Button onClick={onClose} variant="outlined" color="secondary" sx={{ fontSize: '14px' }}>
              Cancel
            </Button>
          </div>
        </Box>
      </form>
    </Box>
  );
};
export default UpdateTwoOptionCard;