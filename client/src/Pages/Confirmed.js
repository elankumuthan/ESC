import React from 'react';
import Navbar from "../Components/Navbar";
import { useLocation } from 'react-router-dom';

function Confirmation() {
  const location = useLocation();
  const { startDate, endDate, guests, destinationId, hotelName, hotelId, roomType, roomPrice } = location.state || {};

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#EAECED' }}>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css" />
        <table align="center" bgcolor="#EAECED" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
            </tr>
            <tr style={{ fontSize: 0, lineHeight: 0 }}>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td align="center" valign="top">
                <table width="600">
                  <tbody>
                    <tr>
                      <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0" width="570">
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td align="center" valign="top">
                        <table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" style={{ overflow: 'hidden!important', borderRadius: '3px' }} width="580">
                          <tbody>
                            <tr>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td align="center">
                                <table width="85%">
                                  <tbody>
                                    <tr>
                                      <td align="center">
                                        <h2 style={{ margin: 0, fontFamily: "'Open Sans', helvetica, arial, sans-serif", fontSize: '28px', lineHeight: '38px', fontWeight: 200, color: '#252b33' }}>
                                          New Booking Confirmation
                                        </h2>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td align="center">
                                <table border="0" cellpadding="0" cellspacing="0" width="78%">
                                  <tbody>
                                    <tr>
                                      <td align="left" style={{ fontFamily: "'Open Sans', helvetica, arial, sans-serif", fontSize: '16px', lineHeight: '30px', fontWeight: 100, color: '#7e8890' }}>
                                        <p>Your booking has been confirmed, please check your email for receipt. As always, feel free to drop us an email should you have any questions.</p>
                                        <ul style={{ textAlign: 'left' }}>
                                          <li>Hotel Name: <strong>{hotelName}</strong></li>
                                          <li>Details: <strong>{guests ? `Adults: ${guests.adults}, Children: ${guests.children}, Rooms: ${guests.rooms}` : 'N/A'}</strong></li>
                                          <li>Check in: <strong>{startDate}</strong></li>
                                          <li>Check out: <strong>{endDate}</strong></li>
                                          <li>Room Type: <strong>{roomType}</strong></li>
                                          <li>Cost: <strong>{roomPrice}</strong></li>
                                        </ul>
                                        <p>Kind regards</p>
                                        <p>Ascenda Bookings Team</p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td align="center" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0">
                                  <tbody>
                                    <tr>
                                      <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td>&nbsp;</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td>&nbsp;</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0" width="580">
                          <tbody>
                            <tr>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td align="center" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#7e8890', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.045em' }} valign="top">
                              Book with Ascenda &#9679; © 2024 Ascenda
                              </td>
                            </tr>
                            <tr style={{ padding: 0, margin: 0, fontSize: 0, lineHeight: 0 }}>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td align="center" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#7e8890', fontSize: '11px', letterSpacing: '.05em' }} valign="top">
                                <em></em>
                              </td>
                            </tr>
                            <tr style={{ padding: 0, margin: 0, fontSize: 0, lineHeight: 0 }}>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td align="center" valign="top">
                                <p style={{ marginBottom: '1em', fontFamily: 'Open Sans, sans-serif', padding: 0, margin: 0, color: '#7e8890', fontSize: '12px', fontWeight: 300 }}>
                                  <span>143 Cecil St, Singapore 069542</span>
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td>&nbsp;</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Confirmation;
