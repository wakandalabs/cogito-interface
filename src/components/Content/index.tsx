import { Divider, Heading, IconButton, Spacer, Stack, useColorMode } from "@chakra-ui/react"
import { Trans } from "@lingui/macro"
import { FC, ReactNode } from "react"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"

interface ContentProps {
  label: string
  children: ReactNode
  hasDivider?: boolean
  hasTitle?: boolean
}

export const Content: FC<ContentProps> = props => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Stack w={"100%"} h={"100%"} spacing={0} overflow={"hidden"}>
      {props.hasTitle && (
        <Stack direction={"row"} alignItems={"center"} px={4} py={2}>
          <Heading fontWeight={"bold"} fontSize={"xl"}>
            <Trans>{props.label}</Trans>
          </Heading>
          <Spacer />
          <IconButton
            aria-label={"btn"}
            icon={colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
            size={"sm"}
            onClick={toggleColorMode}
          />
        </Stack>
      )}
      {props.hasDivider && <Divider />}
      <Stack overflow={"scroll"} pb={20}>
        {props.children}
      </Stack>
    </Stack>
  )
}

export default Content
