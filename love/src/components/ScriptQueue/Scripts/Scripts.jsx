/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

// eslint-disable-next-line
export const getStatusStyle = (status) => {
  if (!status) return '';
  if (status.toLowerCase() === 'done') return 'ok';
  if (status.toLowerCase() === 'running') return 'running';
  if (status.toLowerCase() === 'loading') return 'running';
  if (status.toLowerCase() === 'configured') return 'ok';
  if (status.toLowerCase() === 'unconfigured') return 'warning';
  if (status.toLowerCase() === 'paused') return 'warning';
  if (status.toLowerCase() === 'stopping') return 'warning';
  if (status.toLowerCase() === 'ending') return 'warning';
  if (status.toLowerCase() === 'stopped') return 'warning';
  if (status.toLowerCase() === 'terminated') return 'alert';
  if (status.toLowerCase() === 'failed') return 'alert';
  if (status.toLowerCase() === 'failing') return 'alert';
  if (status.toLowerCase() === 'configurefailed') return 'alert';
  return '';
};
