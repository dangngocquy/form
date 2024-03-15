// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { API_URL } from '../../api';
// import Notfound from '../Notfound';

// const ReportViewer = () => {
//     const { keys } = useParams();
//     const [reportData, setReportData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     useEffect(() => {
//         const fetchReportById = async () => {
//             try {
//                 const response = await axios.get(`${API_URL}/report/get/${keys}`);
//                 setReportData(response.data.data);
//             } catch (error) {
//                 console.clear(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchReportById();
//     }, [keys]);

//     // const embedConfig = {
//     //     type: 'report',
//     //     id: '4bf20a4f-98d1-4ccb-a5f2-618fb87417aa',
//     //     embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiNGMxN2E3ZmMtMDEyMC00M2MxLTljOTMtNTZmN2IxYzE2NTJhIiwidCI6IjlkZTY0YzFlLTliZGItNDJkMi1iODMzLTdhYTdhZjg3ZTkzZSIsImMiOjEwfQ%3D%3D',
//     //     accessToken: '',
//     //     tokenType: models.TokenType.Embed,
//     //     settings: {
//     //         layoutType: models.LayoutType.MobileLandscape 
//     //     }
//     // };
//     if (loading) {
//         return null;
//     }

//     if (loading) {
//         return null;
//     }

//     return (
//         <>
//             <title>NISO | báo cáo từ phòng ban {reportData.bo_phan_rp}</title>
//             <div className="pc-mobile-report">
//                 {reportData ? (
//                     <iframe src={reportData.link} title={reportData.bo_phan_rp} className='ReportViewer' />
//                 ) : (
//                     <Notfound />
//                 )}
//             </div>
//             <div className="mobile-pc-report">
//                 {reportData ? (
//                     <iframe src={reportData.link_mobile} title={reportData.bo_phan_rp} className='ReportViewer' />
//                 ) : (
//                     <Notfound />
//                 )}
//             </div>
//             {/* {reportData ? (
//                 <PowerBIEmbed
//                     embedConfig={embedConfig}
//                     eventHandlers={null} 
//                     cssClassName="ReportViewer"
//                 />
//             ) : (
//                 <Notfound />
//             )} */}
//         </>
//     );
// };

// export default ReportViewer;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../api';
import Notfound from '../Notfound';
import * as models from 'powerbi-models';
import { PowerBIEmbed } from 'powerbi-client-react';

const ReportViewer = () => {
    const { keys } = useParams();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchReportById = async () => {
            try {
                const response = await axios.get(`${API_URL}/report/get/${keys}`);
                setReportData(response.data.data);
            } catch (error) {
                console.clear(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReportById();
    }, [keys]);

    const embedConfig = {
        type: 'report',
        id: '871c010f-5e61-4fb1-83ac-98610a7e9110',
        embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiNGMxN2E3ZmMtMDEyMC00M2MxLTljOTMtNTZmN2IxYzE2NTJhIiwidCI6IjlkZTY0YzFlLTliZGItNDJkMi1iODMzLTdhYTdhZjg3ZTkzZSIsImMiOjEwfQ%3D%3D',
        accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlhSdmtvOFA3QTNVYVdTblU3Yk05blQwTWpoQSIsImtpZCI6IlhSdmtvOFA3QTNVYVdTblU3Yk05blQwTWpoQSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvOWRlNjRjMWUtOWJkYi00M2MxLTdhYTdhZjg3ZTkzZSIsImlhdCI6MTcxMDQwMTMzMywibmJmIjoxNzEwNDAxMzMzLCJleHAiOjE3MTA0MDYzNjcsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84V0FBQUFHZUdQNTBjQ0VWRUdOeU5LMU1oQTk2cjBJaHM5Vk9QY1Mrd2FMRFZiSXFSbXcyZ3JaeThwOXcyUHkrd1JUTlJ2IiwiYW1yIjpbInB3ZCIsInJzYSJdLCJhcHBpZCI6IjIzZDhmNmJkLTFlYjAtNGNjMi1hMDhjLTdiZjUyNWM2N2JjZCIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiMGEwYjZlODQtYjRiNC00ZmVjLTk2YzUtNjJkOTk0YWEwZmYxIiwiZmFtaWx5X25hbWUiOiJJVCIsImdpdmVuX25hbWUiOiJIb2HMgG5nIEFuaCIsImlwYWRkciI6IjE0LjE2MS40MC4xMyIsIm5hbWUiOiJIb2HMgG5nIEFuaCBJVCIsIm9pZCI6IjAzODlmYTQzLTcyNGYtNGJkMi04ZjdiLTA0MzllZjU5NTExNyIsInB1aWQiOiIxMDAzMjAwMERCMUIxREUyIiwicmgiOiIwLkFWTUFIa3ptbmR1YjBrSzRNM3FucjRmcFBna0FBQUFBQUFBQXdBQUFBQUFBQUFCVEFQMC4iLCJzY3AiOiJBcHAuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZFdyaXRlLkFsbCBDb250ZW50LkNyZWF0ZSBEYXNoYm9hcmQuUmVhZC5BbGwgRGFzaGJvYXJkLlJlYWRXcml0ZS5BbGwgRGF0YWZsb3cuUmVhZC5BbGwgRGF0YWZsb3cuUmVhZFdyaXRlLkFsbCBEYXRhc2V0LlJlYWQuQWxsIERhdGFzZXQuUmVhZFdyaXRlLkFsbCBHYXRld2F5LlJlYWQuQWxsIEdhdGV3YXkuUmVhZFdyaXRlLkFsbCBQaXBlbGluZS5EZXBsb3kgUGlwZWxpbmUuUmVhZC5BbGwgUGlwZWxpbmUuUmVhZFdyaXRlLkFsbCBSZXBvcnQuUmVhZC5BbGwgUmVwb3J0LlJlYWRXcml0ZS5BbGwgU3RvcmFnZUFjY291bnQuUmVhZC5BbGwgU3RvcmFnZUFjY291bnQuUmVhZFdyaXRlLkFsbCBUZW5hbnQuUmVhZC5BbGwgVGVuYW50LlJlYWRXcml0ZS5BbGwgVXNlclN0YXRlLlJlYWRXcml0ZS5BbGwgV29ya3NwYWNlLlJlYWQuQWxsIFdvcmtzcGFjZS5SZWFkV3JpdGUuQWxsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoicmF0RW9haGkxWF9UYVFDSldxeDNza1VscmI0WEdtekZOajBYdDNpdzlaTSIsInRpZCI6IjlkZTY0YzFlLTliZGItNDJkMi1iODMzLTdhYTdhZjg3ZTkzZSIsInVuaXF1ZV9uYW1lIjoiaG9hbmdhbmgucGhhbUBuaXNvLmNvbS52biIsInVwbiI6ImhvYW5nYW5oLnBoYW1Abmlzby5jb20udm4iLCJ1dGkiOiJTajVzbVV1Vm0wdUhqSEFXYWpTSEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiLCIyOTIzMmNkZi05MzIzLTQyZmQtYWRlMi0xZDA5N2FmM2U0ZGUiLCI2OTA5MTI0Ni0yMGU4LTRhNTYtYWE0ZC0wNjYwNzViMmE3YTgiLCJmMDIzZmQ4MS1hNjM3LTRiNTYtOTVmZC03OTFhYzAyMjYwMzMiLCJmMjhhMWY1MC1mNmU3LTQ1NzEtODE4Yi02YTEyZjJhZjZiNmMiLCJmMmVmOTkyYy0zYWZiLTQ2YjktYjdjZi1hMTI2ZWU3NGM0NTEiLCJmZTkzMGJlNy01ZTYyLTQ3ZGItOTFhZi05OGMzYTQ5YTM4YjEiLCI3Mjk4MjdlMy05YzE0LTQ5ZjctYmIxYi05NjA4ZjE1NmJiYjgiLCJhOWVhODk5Ni0xMjJmLTRjNzQtOTUyMC04ZWRjZDE5MjgyNmMiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3BsIjoidmktVk4ifQ.hRHE0zeXp5MPcfyhr1vI5xyI513etvCq1tUhl91vqWwcSSuO_ov2yI-raNXygw-9gXQgkj9MNMI0rweyXoHr5m_VAeofzLbIMBIvKgDw27zw8su1RSPFffpxXG0c2TMyCmDT6ybs0nomobZOZOz3bdDbxrQx_TcFDkpBs2v94RpZg92fTtGHj4YffXECcy4woPxDR868usdFYdb70E-DX-a7WJudeigszP9nj1MfJFKfoCiydhFTjGUfArh354HrKhKMRvVXzuA3aWwkhIOYzbIoQa5YBCW3qLfs7EqiSvLhkF6H8zx6U-A9O-ltw3Y4zf5vG9GxPrlCWLcxSEykxQ',
        tokenType: models.TokenType.Embed,
        settings: {
            layoutType: models.LayoutType.MobilePortrait 
        }
    };

    if (loading) {
        return null;
    }

    return (
        <>
            <title>NISO | báo cáo từ phòng ban {reportData.bo_phan_rp}</title>
            {reportData ? (
                <PowerBIEmbed
                    embedConfig={embedConfig}
                    eventHandlers={null} 
                    cssClassName="ReportViewer"
                />
            ) : (
                <Notfound />
            )}
        </>
    );
};

export default ReportViewer;
