import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@suid/material';
import {Show} from 'solid-js';

const bull = () => (
  <Box
    component="span"
    sx={{display: 'inline-block', mx: '2px', transform: 'scale(0.8)'}}
  >
    •
  </Box>
);

interface ICaptainCardProps {
  captain: IPlayer;
}

export default function CaptainCard({captain}: ICaptainCardProps) {
  const hasTeamStyle = captain?.team ? {background: '#b213'} : {};

  return (
    <Card sx={{minWidth: 275, margin: '10px 0', ...hasTeamStyle}}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{fontSize: 16, fontWeight: 600}}
            color="text.secondary"
            gutterBottom
          >
            #{captain.id} {captain.name} "{captain.nickname}" {captain.surname}
          </Typography>
          <Avatar
            alt="Remy Sharp"
            src="https://mui.com/static/images/avatar/1.jpg"
          />
        </Box>

        <Show when={captain?.team}>
          <Typography gutterBottom variant="h6" component="span">
            Team: {captain.team}
          </Typography>

          <CardMedia
            component="img"
            sx={{width: 151}}
            image="https://mui.com/static/images/avatar/1.jpg"
            alt="Live from space album cover"
          />
        </Show>

        <Typography variant="body1">
          <Typography component="p">
            Max win steak: {captain.maxWinStreak}
          </Typography>
          <Typography component="p">
            Max lost streak: {captain.maxLostStreak}
          </Typography>
          <Typography component="p">
            Total won games: {captain.wonGames}
          </Typography>
          <Typography component="p">
            Total lost games: {captain.lostGames}
          </Typography>
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
