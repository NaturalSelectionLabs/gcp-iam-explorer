import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Role } from "./types";

const useStyles = makeStyles(theme => ({
  table: {
    width: "auto",
  },
  verticalText: {
    writingMode: "vertical-lr",
  },
}));

const specialRoleNames = [
  "roles/owner",
  "roles/editor",
  "roles/viewer",
  "roles/browser",
];

type RoleTableProps = {
  roles: Role[];
};

export const PermissionTable: React.FC<RoleTableProps> = ({ roles }) => {
  const classes = useStyles();

  const { service } = useParams<{ service: string }>();

  const filteredRoles = (service === "project"
    ? roles.filter(role => specialRoleNames.includes(role.name))
    : roles.filter(role => role.name.startsWith(`roles/${service}.`))
  ).sort((a, b) => b.includedPermissions.length - a.includedPermissions.length);

  const relatedPermissons = _.chain(filteredRoles)
    .flatMap(role => role.includedPermissions)
    .uniq()
    .sort()
    .value();

  return (
    <Box component={Paper} p={2}>
      <TableContainer>
        <Table className={classes.table} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Permission</TableCell>
              {filteredRoles.map(role => (
                <TableCell key={role.name}>
                  <span className={classes.verticalText}>
                    {role.name.replace(`roles/${service}.`, "")}
                  </span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {relatedPermissons.map(permission => (
              <TableRow key={permission}>
                <TableCell>{permission}</TableCell>
                {filteredRoles.map(role => (
                  <TableCell key={role.name}>
                    {role.includedPermissions.includes(permission) ? "✔" : ""}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

type ServiceTableProps = {
  roles: Role[];
};

export const ServiceTable: React.FC<ServiceTableProps> = ({ roles }) => {
  const servicesExceptProject = _.chain(roles)
    .filter(role => !specialRoleNames.includes(role.name))
    .map(role => role.name.split("/")[1].split(".")[0])
    .uniq()
    .value();

  const services = ["project", ...servicesExceptProject].sort();

  return (
    <Box component={Paper} p={2}>
      <TableContainer>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Roles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map(service => {
              const relatedRoleNames =
                service === "project"
                  ? specialRoleNames.map(roleName =>
                      roleName.replace("roles/", ""),
                    )
                  : roles
                      .filter(role => role.name.startsWith(`roles/${service}.`))
                      .map(role => role.name.replace(`roles/${service}.`, ""));

              return (
                <TableRow key={service}>
                  <TableCell>
                    <Link component={RouterLink} to={`/services/${service}`}>
                      {service}
                    </Link>
                  </TableCell>
                  <TableCell>{relatedRoleNames.length}</TableCell>
                  <TableCell>{relatedRoleNames.join(", ")}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};