import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import bgimg from '../../../assets/Group 1000006802.png';
import logo from '../../../assets/agri.png';

const PDFDocument = ({ purchaseData, customerDetails, quotations, totalPriceBeforeGST, totalPrice }) => {
 
    if (!purchaseData || !customerDetails || quotations.length === 0) {
        return <div>Loading or no data available...</div>;
    }

    const formattedDate = new Date(purchaseData.invoice_pricing.created_at).toLocaleDateString();
    const fpoDetails = purchaseData?.invoice_pricing?.fpo;


    const styles = StyleSheet.create({
        page: {
            padding: 30,
            fontSize: 10,
            fontFamily: 'Helvetica',
            backgroundColor: '#ffffff',
        },
        contentContainer: {
            position: 'relative',
            zIndex: 2,
        },
        header: {
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
            textTransform: 'uppercase',
        },
        companyLogo: {
            width: 80,
            height: 80,
            position: 'absolute',
            top: 20,
            right: 30,
        },
        table: {
            marginTop: 10,
            borderWidth: 1,
            borderColor: '#000',
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: 10,
        },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: '#fff',
        },
        termHeader: {
            fontWeight: 'bold',
            marginBottom: 5,
            fontSize: 12,
        },
        tableRow: {
            flexDirection: 'row',
        },
        tableCell: {
            padding: 5,
            flex: 1,
            borderWidth: 1,
            borderColor: '#000',
            textAlign: 'center',
        },
        tableCellWide: {
            flex: 2,
        },
        footer: {
            marginTop: 10,
            fontSize: 10,
            lineHeight: 1.5,
            textAlign: 'left',
        },
        totalPri: {
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'flex-end',
        },
        titleSection: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 0,
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            color: '#00B251',
            marginRight: 10,
        },
        titleLine: {
            flex: 1,
            height: 2,
            backgroundColor: '#00B251',
        },
        waveImage: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 100,
            zIndex: 1,
        },
    });

    return (
       
            <Document>
                <Page size="A4" style={styles.page}>
                    {/* Background wave image */}
                    <Image src={bgimg} style={styles.waveImage} />
                    
                    <View style={styles.contentContainer}>
                        <View style={{ marginBottom: 30 }}>
                            <Image src={logo} style={{ width: '160px' }} />
                            <Image src={`https://apis.agrisarathi.com${fpoDetails?.company_logo}`} style={styles.companyLogo} />
                        </View>

                        <View style={styles.titleSection}>
                            <Text style={styles.title}>Invoice</Text>
                            <View style={styles.titleLine} />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Text>Date: {formattedDate}</Text>
                        </View>

                        <View>
                            <Text>Invoice ID: {purchaseData?.invoice_pricing?.invoice[0]?.invoice_id || 'N/A'}</Text>
                        </View>


                        {/* Customer Details */}
                        <View style={styles.footer}>
                            <Text style={styles.termHeader}>Bill to:</Text>
                            <Text>Name: {customerDetails?.buyer_name || 'N/A'}</Text>
                            <Text>Contact: {customerDetails?.mobile_no || 'N/A'}</Text>
                            <Text>Address: {customerDetails?.address || 'N/A'}</Text>
                            <Text>Company Name: {customerDetails?.company_name || 'N/A'}</Text>
                            <Text>GST Number: {customerDetails?.gst_number || 'N/A'}</Text>
                        </View>

                        {/* FPO Details */}
                        <View style={styles.footer}>
                            <Text style={styles.termHeader}>FPO Information:</Text>
                            <Text>Name: {fpoDetails?.fpo_name}</Text>
                            <Text>Email: {fpoDetails?.email}</Text>
                            <Text>Contact: {fpoDetails?.mobile}</Text>
                            <Text>Address: {fpoDetails?.address}</Text>
                        </View>

                        {/* Table Section */}
                        <View style={styles.table}>
                            {/* Table Header */}
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableCell}>S.N.</Text>
                                <Text style={[styles.tableCell, styles.tableCellWide]}>Product Name</Text>
                                <Text style={styles.tableCell}>Quantity</Text>
                                <Text style={styles.tableCell}>Variant</Text>
                                <Text style={styles.tableCell}>Brand</Text>
                                <Text style={styles.tableCell}>GST (%)</Text>
                                <Text style={styles.tableCell}>GST Amount</Text>
                                <Text style={styles.tableCell}>Unit Price</Text>
                                <Text style={styles.tableCell}>Price Before GST</Text>
                                <Text style={styles.tableCell}>Price</Text>
                            </View>

                            {/* Table Rows */}
                            {Array.isArray(quotations) && quotations.length > 0 ? (
                                quotations.map((item, index) => (
                                    <View style={styles.tableRow} key={index}>
                                        <Text style={styles.tableCell}>{index + 1}</Text>
                                        <Text style={[styles.tableCell, styles.tableCellWide]}>{item.product || 'N/A'}</Text>
                                        <Text style={styles.tableCell}>{item.quantity || 'N/A'}</Text>
                                        <Text style={styles.tableCell}>{item.variant || 'N/A'}</Text>
                                        <Text style={styles.tableCell}>{item.brand || 'N/A'}</Text>
                                        <Text style={styles.tableCell}>{item.gst || 'N/A'}</Text>
                                        <Text style={styles.tableCell}>{item.gst_amount || 'N/A'}</Text>
                                        <Text style={styles.tableCell}>{item.basic_unit_price || 'N/A'}</Text>
                                        <Text style={styles.tableCell}>{item.price_before_gst || 'N/A'}</Text>
                                        <Text style={styles.tableCell}>{item.price || 'N/A'}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text>No Sales available</Text>  // Display a message if there are no quotations
                            )}

                        </View>

                        {/* Total Price Section */}
                        <View style={styles.totalPri}>
                            <Text style={{ marginBottom: 3 }}>Total Price Before GST: {totalPriceBeforeGST}</Text>
                            <Text style={styles.termHeader}>Total Price: {totalPrice}</Text>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.termHeader}>Terms & Conditions:</Text>
                            <Text>1. GST: Included</Text>
                            <Text>2. Payment through RTGS & NEFT</Text>
                        </View>

                        {/* Footer Details */}
                        <View style={styles.footer}>
                            <Text style={styles.termHeader}>FPO Bank Details:</Text>
                            <Text>Bank Name: {fpoDetails?.fpo_bank?.bank_name || 'N/A'}</Text>
                            <Text>Account Number: {fpoDetails?.fpo_bank?.account_number || 'N/A'}</Text>
                            <Text>IFSC Code: {fpoDetails?.fpo_bank?.ifsc_code || 'N/A'}</Text>
                            <Text>GST Number: {fpoDetails?.fpo_bank?.gst_number || 'N/A'}</Text>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.termHeader}>Address:</Text>
                            <Text>Location: House No. 63 Third Floor, Right Side Lane 2, Kahar Singh Estate, Saidulajab, New Delhi-110030</Text>
                        </View>
                    </View>
                </Page>
            </Document>

        
    );
};

export default PDFDocument;
