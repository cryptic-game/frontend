import { Position } from './../../../dataclasses/position.class';
import { ProgramLinkage } from './../../../dataclasses/programlinkage.class';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-desktop-surface',
  templateUrl: './desktop-surface.component.html',
  styleUrls: ['./desktop-surface.component.scss']
})
export class DesktopSurfaceComponent implements OnInit {
  position: Position = new Position(100, 100);
  linkage: ProgramLinkage = new ProgramLinkage(
    'Nemo',
    'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjIxMG1tIgogICBoZWlnaHQ9IjI5N21tIgogICB2aWV3Qm94PSIwIDAgMjEwIDI5NyIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnOCIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45Mi4xIHIxNTM3MSIKICAgc29kaXBvZGk6ZG9jbmFtZT0iRGlyZWN0b3J5SWNvbi5zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIj4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDM3NSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM4MTgxODE7c3RvcC1vcGFjaXR5OjAuNDI3NDUwOTgiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MzcxIiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojODE4MTgxO3N0b3Atb3BhY2l0eToxIgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDM3MyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzMjMiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDBlNGExO3N0b3Atb3BhY2l0eToxIgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDMxOSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izg1ZTZmZjtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQzMjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MzIzIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDMyNSIKICAgICAgIHgxPSIyMDcuOTM1NjgiCiAgICAgICB5MT0iMjU1Ljg0MDQ4IgogICAgICAgeDI9IjAuNTM0NTM2MTIiCiAgICAgICB5Mj0iNDkuNTA4NDE1IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuOTQ2OTQxMzYsMCwwLDAuOTQ2OTQxMzYsMy4xODAzNzIyLDguMTAwNjk5OCkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQzNzUiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0Mzc3IgogICAgICAgeDE9Ijc2Ni43NzE3OSIKICAgICAgIHkxPSI5NTUuNzYwNzQiCiAgICAgICB4Mj0iMTUwLjUzMTUyIgogICAgICAgeTI9IjQyMi45MDM1OSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjI2NDU4MzMzLDAsMCwwLjI2NDU4MzMzLC0yLjc1NjU0LDAuMjY3MjY5NTMpIiAvPgogIDwvZGVmcz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9ImJhc2UiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6em9vbT0iMC40OTQ5NzQ3NSIKICAgICBpbmtzY2FwZTpjeD0iMjguMDkxMTYxIgogICAgIGlua3NjYXBlOmN5PSI1OTguNDYyODkiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijk5MyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMTkxMiIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMTYiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpvYmplY3Qtbm9kZXM9ImZhbHNlIgogICAgIGlua3NjYXBlOnNuYXAtc21vb3RoLW5vZGVzPSJ0cnVlIiAvPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTUiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IkViZW5lIDEiCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIxIj4KICAgIDxjaXJjbGUKICAgICAgIHI9Ijk5LjIxMDcyNCIKICAgICAgIGN5PSIxNTcuOTY2MDUiCiAgICAgICBjeD0iMTA3LjY4Mjc3IgogICAgICAgaWQ9ImNpcmNsZTQzMzEiCiAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6IzgxODE4MTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MS4zMjI5MTY2MztzdHJva2UtbGluZWNhcDpzcXVhcmU7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6c3Ryb2tlIGZpbGwgbWFya2VycyIgLz4KICAgIDxjaXJjbGUKICAgICAgIHN0eWxlPSJvcGFjaXR5OjE7ZmlsbDp1cmwoI2xpbmVhckdyYWRpZW50NDMyNSk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEuMzIyOTE2NjM7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgICBpZD0icGF0aDQzMTciCiAgICAgICBjeD0iMTAyLjM5MTEiCiAgICAgICBjeT0iMTUyLjY3NDQ1IgogICAgICAgcj0iOTkuMjEwNzI0IiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQ0Mzc3KTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC4yNjQ1ODMzMnB4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBkPSJtIDE2NS4wNzMwMiwxMTEuMjYzNTkgLTc0LjI4MDIzLDYwLjEzNzQyIC01My45NjAwMTMsMzAuOTg1NyA0OC4wODU5NTEsNDguMDg1OTYgYSA5OS4yMTA3MjQsOTkuMjEwNzI0IDAgMCAwIDE3LjczOTQ5MiwxLjY4IDk5LjIxMDcyNCw5OS4yMTA3MjQgMCAwIDAgOTkuMjExLC05OS4yMTEgOTkuMjEwNzI0LDk5LjIxMDcyNCAwIDAgMCAtMC4xNzkzMiwtNS4wNjA2NyB6IgogICAgICAgaWQ9InBhdGg0MzY2IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2Q4YjIwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6NTtzdHJva2UtbGluZWNhcDpzcXVhcmU7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6c3Ryb2tlIGZpbGwgbWFya2VycyIKICAgICAgIGQ9Im0gMTQ0LjM0OTYxLDM5My40ODQzOCBjIC01LjAzNjYyLDAgLTkuMDkxOCw0LjA1MzI0IC05LjA5MTgsOS4wODk4NCB2IDc0LjIzMDQ3IGMgMCw1LjAzNjYzIDQuMDU1MTgsOS4wOTE3OSA5LjA5MTgsOS4wOTE3OSBsIDE5My4zNDU3LDAgYyA1LjAzNjY1LDAgOS4wOTE4LC00LjA1NTE2IDkuMDkxOCwtOS4wOTE3OSB2IC0xMS44MTY0MSBsIDEwMS4wNzAzMSwtNC4yNTM5IC0xMDMuNzQ2MDksLTY0LjY0MDYzIC0wLjAyNzQsMC4wMDYgYyAtMi4xMTMzLC0xLjM5NzAyIC0zLjg5MjMzLC0yLjYxNTIzIC02LjM4ODY3LC0yLjYxNTIzIHoiCiAgICAgICB0cmFuc2Zvcm09InNjYWxlKDAuMjY0NTgzMzMpIgogICAgICAgaWQ9InJlY3Q0MzI5IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0ic3Nzc3NzY2NjY3NzIiAvPgogICAgPHJlY3QKICAgICAgIHJ5PSIyLjI2Nzg1NzEiCiAgICAgICB5PSIxMTAuNjEwODkiCiAgICAgICB4PSIzOS4zNjkzMTYiCiAgICAgICBoZWlnaHQ9Ijg3LjE0MDU5NCIKICAgICAgIHdpZHRoPSIxMjYuMTUxMjEiCiAgICAgICBpZD0icmVjdDQzNTEiCiAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2ZjZmZlODtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MS4zMjI5MTY2MztzdHJva2UtbGluZWNhcDpzcXVhcmU7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6c3Ryb2tlIGZpbGwgbWFya2VycyIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2YxYzYwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MS4zMjI5MTY2MztzdHJva2UtbGluZWNhcDpzcXVhcmU7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6c3Ryb2tlIGZpbGwgbWFya2VycyIKICAgICAgIGQ9Ik0gMzguNTY3NTA0LDExOS4yMDQ2MyBIIDE2Ni4zMjIzNCBjIDEuNDgwNjcsMCAyLjY3MjcsMS4xOTIwMiAyLjY3MjcsMi42NzI2OSB2IDc4LjQ2ODg0IGMgMCwxLjQ4MDY3IC0xLjE5MjAzLDIuNjcyNjkgLTIuNjcyNywyLjY3MjY5IEggMzguNTY3NTA0IGMgLTEuNDgwNjczLDAgLTIuNjcyNjk1LC0xLjE5MjAyIC0yLjY3MjY5NSwtMi42NzI2OSB2IC03OC40Njg4NCBjIDAsLTEuNDgwNjcgMS4xOTIwMjIsLTIuNjcyNjkgMi42NzI2OTUsLTIuNjcyNjkgeiIKICAgICAgIGlkPSJyZWN0NDMyNyIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9InNzc3Nzc3NzcyIgLz4KICA8L2c+Cjwvc3ZnPg==',
    'Nemo',
    this.position
  );
  linkage2: ProgramLinkage = new ProgramLinkage(
    'a',
    'b',
    'c',
    new Position(100, 100)
  );

  dragEl: HTMLElement;
  dragElPosition: Position;

  ngOnInit(): void {
    this.setLinkage(this.linkage);
  }

  setLinkage(linkage: ProgramLinkage): void {
    const background = document.getElementById('desktop-surface-background');

    background.innerHTML += `<div
      id="${linkage.getProgram()}"
    >
      <img
        src="data:image/svg+xml;base64,${linkage.getIcon()}"
        id="img"
      />
      ${linkage.getDisplayName()}
    </div>`;

    const linkageAlias = document.getElementById(linkage.getProgram());
    const linkageImg = document.getElementById('img');

    linkageAlias.style.left = `${linkage.getPosition().getX()}px`;
    linkageAlias.style.top = `${linkage.getPosition().getY()}px`;
    linkageAlias.style.position = 'absolute';
    linkageAlias.style.width = '64px';
    linkageAlias.style.height = '64px';
    linkageAlias.style.textAlign = 'center';
    linkageAlias.style.fontSize = '11pt';
    linkageAlias.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
    linkageAlias.style.userSelect = 'none';
    linkageAlias.style.display = 'flex';
    linkageAlias.style.flexDirection = 'column';
    linkageAlias.style.alignItems = 'center';
    linkageAlias.style.justifyContent = 'center';

    Array.from(linkageAlias.children).forEach(el => {
      (el as HTMLElement).style.pointerEvents = 'none';
    });

    linkageImg.style.width = '45px';
    linkageImg.style.height = '45px';

    linkageAlias.addEventListener('mousedown', e => {
      this.dragEl = linkageAlias;

      this.dragEl.style.backgroundColor = 'rgba(0, 0, 0, 0.45)';
      this.dragEl.style.boxShadow = 'inset 0px 0px 2px 2px rgba(0, 0, 0, 0.45)';
      this.dragEl.style.borderRadius = '10px';
      linkageAlias.style.color = '#ddd';

      this.dragElPosition = new Position(e.offsetX, e.offsetY);
    });

    background.addEventListener('mousemove', e => {
      if (this.dragEl) {
        this.dragEl.style.left = `${e.pageX - this.dragElPosition.getX()}px`;
        this.dragEl.style.top = `${e.pageY - this.dragElPosition.getY()}px`;
      }
    });

    linkageAlias.addEventListener('mouseup', () => {
      this.dragEl.style.backgroundColor = 'transparent';
      this.dragEl.style.boxShadow = 'none';
      this.dragEl.style.color = '#000';

      this.dragEl = undefined;
      this.dragElPosition = undefined;
    });
  }
}
