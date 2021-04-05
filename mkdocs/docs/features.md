# Features

## Settings

### Port change

Support **Socks5** and **Http** port change.

![port change](imgs/port_change.png)

### Proxy mode change

Support change proxy mode to `Global`,`Rule` or `Direct`.

![mode change](imgs/mode_change.png)

## Proxies

### Proxy nodes latencies status

Latency status are divided into four levels:

**0-200ms**, **200-500ms**, **500+ms**, **timeout**

Corresponding to these colors respectively:

<div style="
    display: flex;
    margin-bottom: 20px;
">
<div style="
    margin-left: 10px;
    width: 50px;
    height: 20px;
    background-color: #00c781;
"></div>
<div style="
    margin-left: 10px;
    width: 50px;
    height: 20px;
    background-color: #ffaa15;
"></div><div style="
    margin-left: 10px;
    width: 50px;
    height: 20px;
    background-color: #ff4040;
"></div><div style="
    margin-left: 10px;
    width: 50px;
    height: 20px;
    background-color: #cccccc;
"></div>
</div>

The length of the status bar indicates the percentage of the number of corresponding status nodes to the total number of nodes.

![status bars](imgs/status_bars.png)

### Proxy nodes details

Expand the panel to view the details of the proxy nodes.

![proxy nodes details](imgs/proxy_nodes_details.png)

### Policies management

Select a policy group to view details.

![policies management](imgs/policies_management.png)

![policy details](imgs/policy_details.png)

Proxy nodes are arranged in order of latency.

Background highlighted proxy node indicates the one now using, click another to change.

![change_policy](imgs/change_policy.png)

## Profiles

### Download from subscription link

Enter the subscription link address to download the profile.

![sub download](imgs/sub_download.png)

### Select a profile

The profiles are displayed as cards as follows:

![profile cards](imgs/profile_cards.png)

Click on the checkbox to choose a profile for clash to use.

## Logs

Clash logs are shown in this panel.

### Log level

Clash has four log levels: **info**, **warning**, **error**, **debug**.

Select a log level to view different level logs.

![log level](imgs/log_level.png)

### Max history

**Max history** limits the max count of logs, set to 200 as default. The range is between **100-2000**

![max history](imgs/max_history.png)

### Log details

Logs are printed here.

![logs](imgs/logs.png)

## Connections

Clash connections information panel.

### Sort connections

Connections information are not sorted by default. Choose a sort type to sort connection information.

![sort type](imgs/sort_type.png)

Click this icon to switch ascending and descending order

![toggle scending](imgs/toggle_scending.png)

### Filter connections

When sorting is enabled, input filter text to match corresponding connections.

![filter connections](imgs/filter_connections.png)

## Status bar

### Network activity

Realtime network activity is displayed here.

![network activity](imgs/network_activity.png)

### About & Repository

Information of this app and repository address.

![about and repository](imgs/about_and_repository.png)