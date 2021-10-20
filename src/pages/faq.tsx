import { useState, SyntheticEvent } from 'react';
import { GetStaticProps } from "next"
import { FaqModel } from "../../api/Faq"
import { openDB } from "../openDB"
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export interface Props {
  faq: FaqModel[];
}
const FAQ = ({ faq }: Props) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <div>
      {
        faq.map((el, index) => (
          <ExpansionPanel key={el.id}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                {el.question}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                {el.answer}
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>))
      }
    </div>
  )
}

export const getStaticProps = async (ctx: GetStaticProps) => {
  const db = await openDB();
  const faq = await db.all('select * from FAQ')
  return {
    props: {
      faq
    }
  }
}

export default FAQ
