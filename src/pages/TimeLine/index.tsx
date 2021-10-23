import Content from "../../components/Content"
import { Accordion, Spinner, Stack, Text } from "@chakra-ui/react"
import { useCogitoIDs } from "../../hooks/useCogitoIDs"
import { useCurrentUser } from "../../hooks/useCurrentUser"
import { Key, Suspense } from "react"
import CogitoItem from "../../components/CogitoItem"

const CogitoList = () => {
  const { user } = useCurrentUser()
  const cogitoIDs = useCogitoIDs(user.addr)

  if (!user.loggedIn || !cogitoIDs.ids) {
    return (
      <Stack>
        <Text>No cogito</Text>
      </Stack>
    )
  }

  return (
    <Accordion defaultIndex={[]} allowMultiple w={"100%"}>
      {cogitoIDs.ids.map((id: number, index: Key) => (
        <CogitoItem id={id} key={index} />
      ))}
    </Accordion>
  )
}

const TimeLine = () => {
  return (
    <Content label={"TimeLine"}>
      <Suspense
        fallback={
          <Stack p={4}>
            <Spinner />
          </Stack>
        }
      >
        <CogitoList />
      </Suspense>
    </Content>
  )
}

export default TimeLine
