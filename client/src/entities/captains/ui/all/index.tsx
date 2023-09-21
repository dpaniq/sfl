import CaptainCards from "../captains-cards";

import CapitansListJSON from "../../../shared/api/captains/mock/list.json";
import { Button } from "@suid/material";

interface AllCapitainsPropsInterface {
  onNextStage: () => any;
}

export default function AllCaptains({
  onNextStage,
}: AllCapitainsPropsInterface) {
  return (
    <>
      <h1>I. All capitans</h1>
      <hr />
      <CaptainCards captains={CapitansListJSON} />
      <Button onClick={onNextStage} variant="contained">
        On next stage
      </Button>
    </>
  );
}
